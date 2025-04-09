import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Неверный формат заголовка авторизации' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена, доступ запрещен' });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET не определен');

    req.user = jwt.verify(token, secret) as { id: string };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Срок действия токена истек' });
    }
    res.status(401).json({ message: 'Неверный токен' });
  }
};
