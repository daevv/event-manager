import { Request, Response } from 'express';
import Event from '@/models/event';
import EventAdmin from '@/models/eventAdmin';
import EventRegistration from '@/models/eventRegistration';
import { logger } from '@/services/logger';

// 1. Мероприятия, где пользователь — организатор
export const getOrganizedEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll({
      where: { organizerId: req.params.id }
    });

    return res.json(events);
  } catch (error) {
    logger.error('Error fetching organized events', { error });
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// 2. Мероприятия, где пользователь — администратор
export const getAdministeredEvents = async (req: Request, res: Response) => {
  try {
    // Проверяем, что req.user существует и имеет id
    if (!req.user || !req.user.id) {
      logger.error('Пользователь не авторизован или отсутствует user.id', { user: req.user });
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    const adminEventIds = await EventAdmin.findAll({
      where: { userId: req.user.id },
      attributes: ['eventId']
    });

    const eventIds = adminEventIds.map((admin) => admin.eventId);

    const events = await Event.findAll({
      where: { id: eventIds }
    });

    return res.json(events);
  } catch (error) {
    logger.error('Ошибка при получении администрируемых событий', { error });
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

// 3. Мероприятия, где пользователь — участник (зарегистрирован)
export const getRegisteredEvents = async (req: Request, res: Response) => {
  try {
    const registrations = await EventRegistration.findAll({
      where: {
        userId: req.user!.id,
        status: 'registered'
      },
      attributes: ['eventId']
    });

    const eventIds = registrations.map((reg) => reg.eventId);

    const events = await Event.findAll({
      where: { id: eventIds }
    });

    return res.json(events);
  } catch (error) {
    logger.error('Error fetching registered events', { error });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
