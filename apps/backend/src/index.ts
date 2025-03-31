import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import cors from 'cors';

import authRoutes from '@/routes/auth';
import eventRoutes from '@/routes/events';
import commentRoutes from '@/routes/comments';
import { sequelize } from '@/config/db';
import bodyParser from 'body-parser';

export const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());

app.use(compression());

app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT ?? 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
