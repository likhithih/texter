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
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

connectDb(process.env.MONGO_URL)

app.use("/api", userRouter)

// initialize socket.io with http server
const io = initSocket(server)

server.listen(port, () => {
    console.log("server is started");
})