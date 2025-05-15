import { Request, Response } from 'express';
import Blacklist from '../models/blacklist';
import User from '@/models/user';
import { logger } from '@/services/logger';

export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const blockedUsers = await Blacklist.findAll({
      where: { organizerId },
      include: [
        {
          model: User,
          as: 'bannedUser'
        }
      ]
    });

    res.json(blockedUsers);
  } catch (error) {
    logger.error('Get blacklists error', { error });
    res.status(500).json({ message: 'Произошла ошибка при получении черного списка' });
  }
};

export const addToBlacklist = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email }, raw: true });
  if (!user) {
    return res.status(404).json({ message: 'Пользователь с таким email не найден' });
  }

  await Blacklist.create({ organizerId: req.user?.id, bannedUserId: user.id });
  res.status(201).json({ message: 'Пользователь добавлен в черный список' });
};

export const removeFromBlacklist = async (req: Request, res: Response) => {
  const blacklistNote = await Blacklist.findOne({
    where: { bannedUserId: req.params.id }
  });
  if (!blacklistNote) return res.status(404).json({ message: 'Запись не найдена' });
  if (blacklistNote.dataValues.organizerId !== req.user?.id) {
    return res.status(403).json({ message: 'Только организатор может удалять из черного списка' });
  }
  await blacklistNote.destroy();
  res.json({ message: 'Пользователь удален из черного списка' });
};
