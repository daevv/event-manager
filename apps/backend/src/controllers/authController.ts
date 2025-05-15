import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { compare, hash } from 'bcryptjs';
import { sendVerificationEmail } from '@/services/emailService';
import { logger } from '@/services/logger';

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
    emailVerified: false,
    interests: []
  });

  const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
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
    const userWithoutSensitiveData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      secondName: user.secondName,
      interests: user.interests

      // и так далее для всех нужных полей
    };
    res.json({ token, userWithoutSensitiveData });
  } catch (error) {
    logger.error('Login error', { error });
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
    logger.error('Verify error', { err });
    res.status(400).json({ message: 'Неверный или просроченный токен' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, repeatPassword } = req.body;
  const userId = req.user?.id; // предполагаем, что auth middleware добавляет user в req

  if (!userId) {
    return res.status(401).json({ message: 'Не авторизован' });
  }

  if (!currentPassword || !newPassword || !repeatPassword) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  if (newPassword !== repeatPassword) {
    return res.status(400).json({ message: 'Новый пароль и его подтверждение не совпадают' });
  }

  // Валидация пароля (8+ символов, хотя бы одна цифра, одна заглавная латинская буква)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Пароль должен содержать минимум 8 символов, 1 заглавную латинскую букву и 1 цифру'
    });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isCurrentPasswordValid = await compare(currentPassword, user.dataValues.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Текущий пароль неверный' });
    }

    const newPasswordHash = await hash(newPassword, 10);

    await user.update({ passwordHash: newPasswordHash });
    await user.save();

    res.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    logger.error('Change password error:', { error });
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
