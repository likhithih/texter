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
app.use(cors({
    origin:"http://localhost:5173"
}))

connectDb(process.env.MONGO_URL)

app.use("/api", userRouter)

// initialize socket.io with http server
const io = initSocket(server)

server.listen(port, () => {
    console.log("server is started");
})