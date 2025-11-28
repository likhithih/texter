import User from "../model/User.js";
import Message from "../model/Message.js";
import jwt from "jsonwebtoken";
import { getIO } from "../socket.js";

// ===== Login =====
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    if (user.password !== password)
      return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "7h" });

    return res.json({
      success: true,
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// ===== Signup =====
export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User already exists" });

    const newUser = await User.create({ name, email, password });

    return res.json({
      success: true,
      message: "User created",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// ===== Get Users =====
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// ===== Get Messages Between Two Users =====
export const getMessages = async (req, res) => {
  try {
    const { userId, otherId } = req.query;
    if (!userId || !otherId)
      return res.json({ success: false, message: "userId and otherId are required" });

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: otherId },
        { senderId: otherId, recipientId: userId }
      ]
    })
      .populate("senderId", "name email")
      .populate("recipientId", "name email")
      .sort({ timestamp: 1 });

    return res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// ===== Send Message =====
export const saveMessage = async (req, res) => {
  try {
    const { senderId, recipientId, text } = req.body;
    if (!senderId || !recipientId || !text)
      return res.json({ success: false, message: "senderId, recipientId and text are required" });

    const message = await Message.create({ senderId, recipientId, text });
    const populated = await Message.findById(message._id)
      .populate("senderId", "name email")
      .populate("recipientId", "name email");

    // Emit message via socket
    const io = getIO();
    if (io && io.onlineUsers) {
      const recipientSocketId = io.onlineUsers.get(recipientId.toString());
      if (recipientSocketId) io.to(recipientSocketId).emit("newMessage", populated);

      const senderSocketId = io.onlineUsers.get(senderId.toString());
      if (senderSocketId) io.to(senderSocketId).emit("messageSent", populated);
    }

    return res.json({ success: true, message: "Message sent", data: populated });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Something went wrong" });
  }
};
