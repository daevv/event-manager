import { Request, Response } from 'express';
import Event from '@/models/event';
import EventAdmin from '@/models/eventAdmin';
import EventRegistration from '@/models/eventRegistration';
import User from '@/models/user';
import { logger } from '@/services/logger';

// Получение данных пользователя
export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] } // Используем camelCase в соответствии с моделью
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.json(user);
  } catch (error) {
    logger.error('Error fetching user data', { userId: req.params.id, error });
    return res.status(500).json({ message: 'Ошибка сервера при получении данных пользователя' });
  }
};

// Получение данных пользователя
export const getOrganizer = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      attributes: { include: ['id', 'email', 'firstName', 'secondName'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.json(user);
  } catch (error) {
    logger.error('Error fetching user data', { userId: req.params.id, error });
    return res.status(500).json({ message: 'Ошибка сервера при получении данных организатора' });
  }
};

// Обновление данных пользователя
export const updateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!req.user || req.user.id !== userId) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Валидация входных данных (можно дополнить с помощью Joi/zod)
    const { firstName, secondName, email, interests, favourites } = req.body;
    if (!firstName && !secondName && !email && !interests && !favourites) {
      return res.status(400).json({ message: 'Не указаны данные для обновления' });
    }

    const [updated] = await User.update(req.body, {
      where: { id: userId },
      // Включаем валидацию модели
      validate: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] }
    });

    return res.json({ message: 'Данные обновлены', user: updatedUser });
  } catch (error: any) {
    logger.error('Error updating user data', { userId: req.params.id, error: error.message });
    return res.status(500).json({ message: 'Ошибка сервера при обновлении данных пользователя' });
  }
};

// Получение мероприятий, где пользователь — организатор
export const getOrganizedEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const events = await Event.findAll({
      where: { organizerId: userId },
      attributes: ['id', 'title', 'description', 'dateTime', 'eventStatus', 'imageUrl'] // Выбираем только нужные поля
    });

    return res.json(events);
  } catch (error) {
    logger.error('Error fetching organized events', { userId: req.params.id, error });
    return res
      .status(500)
      .json({ message: 'Ошибка сервера при получении организованных мероприятий' });
  }
};

// Получение мероприятий, где пользователь — администратор
export const getAdministeredEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      logger.warn('Unauthorized access attempt', { user: req.user });
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    console.log(req.user.id);
    const events = await Event.findAll({
      include: [
        {
          model: EventAdmin,
          where: { userId: req.user.id },
          attributes: [], // Не включаем данные EventAdmin в ответ
          required: true
        }
      ],
      attributes: ['id', 'title', 'description', 'dateTime', 'eventStatus'] // Выбираем только нужные поля
    });

    return res.json(events);
  } catch (error) {
    logger.error('Error fetching administered events', { userId: req.user?.id, error });
    return res
      .status(500)
      .json({ message: 'Ошибка сервера при получении администрируемых мероприятий' });
  }
};

// Получение мероприятий, где пользователь — участник
export const getRegisteredEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      logger.warn('Unauthorized access attempt', { user: req.user });
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const events = await Event.findAll({
      include: [
        {
          model: EventRegistration,
          where: { userId: req.user.id, status: 'registered' },
          attributes: [], // Не включаем данные EventRegistration в ответ
          required: true
        }
      ],
      attributes: ['id', 'title', 'description', 'dateTime', 'eventStatus'] // Выбираем только нужные поля
    });

    return res.json(events);
  } catch (error) {
    logger.error('Error fetching registered events', { userId: req.user?.id, error });
    return res
      .status(500)
      .json({ message: 'Ошибка сервера при получении зарегистрированных мероприятий' });
  }
};
