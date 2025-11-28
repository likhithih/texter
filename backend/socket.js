import { Server } from 'socket.io';

let io = null;
const onlineUsers = new Map();

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
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
