import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;
const onlineUsers = new Map();

export function initSocket(server, allowedOrigins = ['http://localhost:5173', 'https://chatbox-xwqh.onrender.com']) {
  const corsOrigins = (Array.isArray(allowedOrigins) && allowedOrigins.length) ? allowedOrigins : ['http://localhost:5173'];
  console.log('Socket CORS origins:', corsOrigins);

  io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser tools
        if (corsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS not allowed'), false);
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);

    // Optional: authenticate using token from client
    socket.on('register', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.id;
        onlineUsers.set(userId.toString(), socket.id);
        console.log(`User registered on socket: ${userId}`);
      } catch (err) {
        console.log('Invalid token for socket registration:', err.message);
        socket.disconnect();
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User disconnected: ${userId}`);
          break;
        }
      }
    });
  });

  io.onlineUsers = onlineUsers;
  return io;
}

export function getIO() {
  return io;
}
