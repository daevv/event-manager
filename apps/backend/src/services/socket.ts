// services/socket.service.ts
import { Server, Socket } from 'socket.io';
import { Request } from 'express';
import { authenticate } from '@/middleware/auth';

// Расширяем тип Socket для хранения пользователя
interface AuthenticatedSocket extends Socket {
  user?: { id: string };
}

export const initializeSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware для аутентификации сокетов
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // Создаем фейковый Request объект для использования вашего middleware
      const mockRequest = {
        header: (name: string) => {
          if (name === 'Authorization') {
            return socket.handshake.auth.token ? `Bearer ${socket.handshake.auth.token}` : null;
          }
          return null;
        }
      } as Request;

      const mockResponse = {
        status: (code: number) => ({
          json: (data: any) => {
            if (code === 401) {
              throw new Error(data.message || 'Unauthorized');
            }
            return data;
          }
        })
      } as unknown as Response;

      // Используем ваш существующий middleware
      await new Promise<void>((resolve, reject) => {
        authenticate(mockRequest, mockResponse, (err) => {
          if (err) return reject(err);
          socket.user = mockRequest.user;
          resolve();
        });
      });

      if (socket.user) {
        socket.join(`user_${socket.user.id}`);
        console.log(`User ${socket.user.id} authenticated via WebSocket`);
      }

      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.user) return socket.disconnect();

    console.log(`User ${socket.user.id} connected`);

    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.id} disconnected`);
    });
  });

  return io;
};

// Глобальная переменная для доступа к io
let ioInstance: Server;

export const setSocketInstance = (io: Server) => {
  ioInstance = io;
};

export const getSocketIOInstance = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized');
  }
  return ioInstance;
};
