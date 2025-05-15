import express from 'express';
import { sequelize } from '@/config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import blacklistRoutes from './routes/blacklists';
import groupRoutes from './routes/groups';
import commentRoutes from './routes/comments';
import logsRoutes from './routes/logs';
import cors from 'cors';
import morgan from 'morgan';
import { httpLoggingMiddleware, morganToDb } from '@/services/logger';
import { attachUserToLog } from '@/middleware/attachUserToLog';

const app = express();
const morganMiddleware = morgan(
  (tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res),
      'ms',
      (req as any).userId
    ].join(' ');
  },
  {
    stream: morganToDb(),
    skip: (req) => req.method === 'GET' // Пропускаем GET-запросы
  }
);

app.use(cors());

app.use(express.json());
app.use(attachUserToLog); // Добавляем ДО Morgan
// Инициализация Morgan с записью в БД
app.use(morganMiddleware); // Подключаем Morgan
// Дополнительное логирование через Winston (в файлы/консоль)
app.use(httpLoggingMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/blacklists', blacklistRoutes);
app.use('/groups', groupRoutes);
app.use('/comments', commentRoutes);
app.use('/logs', logsRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});
