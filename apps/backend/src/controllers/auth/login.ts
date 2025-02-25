import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/models/user.model';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    res.json({ message: 'Logged in', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};
