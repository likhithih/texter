import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./db/connecction.js";
import userRouter from "./routes/user.js";
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8001;

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // single frontend URL from env
];

console.log("Allowed origins for CORS:", allowedOrigins);

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

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
