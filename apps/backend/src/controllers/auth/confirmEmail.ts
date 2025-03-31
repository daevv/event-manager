import { Request, Response } from 'express';
import { User } from '@/models/user.model';
import bcrypt from 'bcryptjs';

export const confirmEmail = async (req: Request, res: Response) => {
  const { email, confirmationCode } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Проверяем, не истёк ли код
    if (user.confirmationCodeExpires && new Date(user.confirmationCodeExpires) < new Date()) {
      return res.status(400).json({ message: 'Confirmation code has expired' });
    }

    // Проверяем правильность кода
    if (user.confirmationCode !== confirmationCode) {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    // Проверка количества попыток
    if (user.failedAttempts >= 5) {
      return res.status(429).json({ message: 'Too many failed attempts. Try again later.' });
    }

    // Проверка кода с bcrypt
    const isCodeValid = await bcrypt.compare(confirmationCode, user.confirmationCode ?? '');
    if (!isCodeValid) {
      user.failedAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    user.confirmationCode = null;
    user.confirmationCodeExpires = null;
    user.failedAttempts = 0;
    user.isConfirmed = true;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email confirmation failed', error });
  }
};
