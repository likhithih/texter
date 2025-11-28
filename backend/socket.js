import { Server } from 'socket.io';

let io = null;
const onlineUsers = new Map();

export function initSocket(server, allowedOrigins = ['http://localhost:5173']) {
  const corsOrigins = (Array.isArray(allowedOrigins) && allowedOrigins.length) ? allowedOrigins : ['http://localhost:5173'];
  console.log('Socket CORS origins:', corsOrigins);
  io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (corsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS not allowed'), false);
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('register', (userId) => {
      // store socket id for user
      onlineUsers.set(userId.toString(), socket.id);
    });

    socket.on('disconnect', () => {
      // remove from map
      for (const [userId, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(userId);
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
