import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();
router.put(
  '/role/:id',
  authenticate,
  authorizeRoles('root'),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.role = req.body.role;
      await user.save();

      res.json({ message: 'Role updated successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const confirmUrl = `${process.env.APP_URL}/auth/confirm/${user.id}`;
    await sendEmail(
      email,
      'Confirm your registration',
      `<p>Click <a href="${confirmUrl}">here</a> to confirm your registration.</p>`
    );

    res.status(201).json({
      message: 'User registered. Please check your email to confirm.',
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
