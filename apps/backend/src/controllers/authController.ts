import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { compare, hash } from 'bcryptjs';
import { sendVerificationEmail } from '@/services/emailService';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, secondName } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email уже используется' });

  const passwordHash = await hash(password, 10);
  const user = await User.create({
    email,
    passwordHash,
    firstName,
    secondName,
    emailVerified: false
  });

  const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '5m'
  });
  await sendVerificationEmail(email, verificationToken);

  res.status(201).json({ message: 'Пользователь зарегистрирован. Подтвердите email.' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Проверка наличия email и password в теле запроса
  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    // Поиск пользователя
    const user = await User.findOne({ where: { email }, raw: true });
    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Подтвердите email перед входом' });
    }

    // Сравнение пароля
    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Генерация токена
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { id: string };
    const [updatedRows] = await User.update({ emailVerified: true }, { where: { id: decoded.id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json({ message: 'Email подтвержден' });
  } catch (err) {
    res.status(400).json({ message: 'Неверный или просроченный токен' });
  }
};
