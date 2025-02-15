import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync({ alter: true });
  console.log('таблицы созданы');
});
