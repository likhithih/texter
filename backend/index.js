import express from "express"
import http from 'http'
import mongoose from"mongoose"
import connectDb from "./db/connecction.js"
import userRouter from "./routes/user.js"
import dotenv from "dotenv";
import cors from "cors";
import { initSocket } from './socket.js'

dotenv.config()

const app=express()
const server = http.createServer(app)
const port= process.env.PORT || 8001

app.use(express.json())
const allowedOrigins = [
  "http://localhost:5173",           // local frontend
  process.env.FRONTEND_URL            // deployed frontend
].filter(Boolean);

// log the allowed origins so we can verify what's active in production
console.log('Allowed origins for CORS:', allowedOrigins);
console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
    return callback(new Error(msg), false);
  },
  credentials: true
}));

connectDb(process.env.MONGO_URL)

app.use("/api", userRouter)

// initialize socket.io with http server - pass allowed origins so socket.js doesn't access env during module import
const io = initSocket(server, allowedOrigins)

server.listen(port, () => {
    console.log("server is started");
})