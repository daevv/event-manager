import express, { Express, Request } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import db from '@/models';
import { httpLoggingMiddleware, morganToDb } from '@/services/logger';
import { attachUserToLog } from '@/middleware/attachUserToLog';
import { initializeSocket, setSocketInstance } from '@/services/socket';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import blacklistRoutes from './routes/blacklists';
import groupRoutes from './routes/groups';
import commentRoutes from './routes/comments';
import logsRoutes from './routes/logs';
import notificationsRoutes from './routes/notifications';
import adminRoutes from './routes/admin';

// Расширяем интерфейс Request для типизации userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Конфигурация приложения
const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

// Конфигурация Morgan для логирования запросов
const morganMiddleware = morgan(
  (tokens, req: AuthenticatedRequest, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res),
      'ms',
      req.userId || 'anonymous'
    ].join(' ');
  },
  {
    stream: morganToDb(),
    skip: (req) => req.method === 'GET' // Пропускаем GET-запросы
  }
);

// Инициализация middleware
function setupMiddleware() {
  // CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    })
  );

  // Парсинг JSON
  app.use(express.json());

  // Добавление userId для логирования
  app.use(attachUserToLog);

  // Логирование HTTP-запросов через Morgan
  app.use(morganMiddleware);

  // Дополнительное логирование через Winston
  app.use(httpLoggingMiddleware);

  // Статические файлы
  app.use('/uploads', express.static('uploads'));
}

// Инициализация маршрутов
function setupRoutes() {
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/events', eventRoutes);
  app.use('/blacklists', blacklistRoutes);
  app.use('/groups', groupRoutes);
  app.use('/comments', commentRoutes);
  app.use('/logs', logsRoutes);
  app.use('/notifications', notificationsRoutes);
  app.use('/admin', adminRoutes);
}

// Инициализация Socket.IO
function setupSocketIO(): Server {
  const io = initializeSocket(httpServer);
  setSocketInstance(io);
  return io;
}

// Запуск сервера
async function startServer() {
  try {
    // Синхронизация базы данных
    console.log('Начало синхронизации базы данных');
    await db.sequelize.sync({ force: false });
    console.log('Синхронизация завершена');

    // Настройка middleware
    setupMiddleware();

    // Настройка маршрутов
    setupRoutes();

    // Настройка Socket.IO
    setupSocketIO();

    // Запуск сервера
    httpServer.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1); // Завершаем процесс при ошибке
  }
}

// Запуск приложения
startServer();
