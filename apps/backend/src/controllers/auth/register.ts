import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '@/models/user.model';
import { generateConfirmationCode, sendConfirmationEmail } from '@/controllers/auth/lib';
import { Op } from 'sequelize';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const now = new Date();
    await User.destroy({
      where: {
        confirmationCodeExpires: {
          [Op.lt]: now // Убираем пользователей с истекшим кодом
        }
      }
    });
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const confirmationCode = generateConfirmationCode();
    const newUser = await User.create({
      email,
      password: hashedPassword,
      confirmationCode,
      confirmationCodeExpires: new Date(Date.now() + 300000) // 5 минут
    });

    await sendConfirmationEmail(email, confirmationCode);

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};
