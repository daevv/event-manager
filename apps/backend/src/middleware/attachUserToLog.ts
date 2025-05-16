// src/middlewares/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const attachUserToLog = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  // Если заголовок отсутствует или не начинается с 'Bearer ', просто продолжаем
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.userId = undefined; // Устанавливаем userId как undefined для публичных запросов
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      req.userId = decoded.id; // Добавляем userId для логирования
    } catch (e) {
      // Токен невалидный - продолжаем без userId
      req.userId = undefined;
    }
  }

  next();
};
