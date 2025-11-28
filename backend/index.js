import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./db/connecction.js";
import userRouter from "./routes/user.js";
import { initSocket, getIO } from "./socket.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8001;

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // frontend URL from env
];
console.log("Allowed origins for CORS:", allowedOrigins);

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"), false);
  },
  credentials: true
}));

// Connect to MongoDB
connectDb(process.env.MONGO_URL);

// API routes
app.use("/api", userRouter);

// Initialize Socket.IO
const io = initSocket(server, allowedOrigins);

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: Token missing"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // attach userId to socket
    next();
  } catch (err) {
    console.error("Socket authentication failed:", err.message);
    next(new Error("Authentication error: Invalid token"));
  }
});

// Listen to socket connections
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id, "User:", socket.userId);

  // Register user in online users map
  io.onlineUsers.set(socket.userId, socket.id);

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id, "User:", socket.userId);
    io.onlineUsers.delete(socket.userId);
  });

  // Optional: handle custom events here (if not in frontend)
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
