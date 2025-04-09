import express from 'express';
import { sequelize } from '@/config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import blacklistRoutes from './routes/blacklists';
import groupRoutes from './routes/groups';
import commentRoutes from './routes/comments';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/blacklists', blacklistRoutes);
app.use('/groups', groupRoutes);
app.use('/comments', commentRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});
