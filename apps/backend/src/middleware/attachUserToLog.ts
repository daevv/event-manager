// src/middlewares/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const attachUserToLog = (req: Request, res: Response, next: NextFunction) => {
  // 1. Достаём токен из заголовка
  const authHeader = req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Неверный формат заголовка авторизации' });
  }

  const token = authHeader.split(' ')[1];

  // 2. Если токен есть, пробуем декодировать
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      // 3. Добавляем userId в request для использования в Morgan
      req.userId = decoded.id;
    } catch (e) {
      // Токен невалидный - пропускаем
    }
  }

  next();
};
