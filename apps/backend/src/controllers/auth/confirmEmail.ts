import { Request, Response } from 'express';
import { User } from '@/models/user.model';

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

    // Код верный, обновляем статус пользователя (например, активируем его)
    user.confirmationCode = null; // Убираем код подтверждения после подтверждения
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Email confirmation failed', error });
  }
};
