import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
    console.warn(err);
  }
};

export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findByPk(req.user.id);

    if (!user || !roles.includes(user.role)) {
      return res
        .status(403)
        .json({ error: 'Access denied. You do not have permission.' });
    }

    next();
  };
};
