import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import Event from '../models/event';
import EventAdmin from '../models/eventAdmin';
import EventRegistration from '../models/eventRegistration';
import Blacklist from '../models/blacklist';
import User from '@/models/user';
import { logger } from '@/services/logger';
import { createNotification } from '@/services/notificationService';
import { NotificationType } from '@/models/notification';
import GroupMember from '@/models/groupMember';

// Конфигурация загрузки файлов
const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req: Request, file, cb) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Только изображения формата JPEG или PNG!'));
      }
    }
  }).single('image');
};

const upload = configureMulter();

// Валидация данных события
const validateEventData = (req: Request) => {
  const { isLocal, groupId, location } = req.body;

  if (isLocal === 'true' && !groupId) {
    throw new Error('groupId обязателен для локальных мероприятий');
  }

  if (location) {
    try {
      const parsedLocation = JSON.parse(location);
      if (!parsedLocation?.lat || !parsedLocation?.lng) {
        throw new Error('Некорректный формат локации');
      }
    } catch (e) {
      logger.error('Invalid location JSON', { e });
      throw new Error('Некорректный JSON локации');
    }
  }
};

// Обработка ошибок контроллеров
const handleControllerError = (res: Response, error: unknown, defaultMessage: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;

  if (!res.headersSent) {
    logger.error(message, { error });
    res.status(500).json({ error: message });
  } else {
    console.error('Ответ уже отправлен:', message, error);
  }
};

// Контроллеры событий
export const eventController = {
  createEvent: async (req: Request, res: Response) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      try {
        validateEventData(req);

        const {
          title,
          description,
          dateTime,
          isLocal,
          groupId,
          categories,
          isFree,
          price,
          maxParticipantsCount
        } = req.body;

        const eventData = {
          title,
          description,
          dateTime,
          organizerId: req.user?.id as string,
          isLocal: isLocal === 'true',
          groupId,
          categories: categories ? JSON.parse(categories) : [],
          isFree: isFree === 'true',
          price: price ? Number(price) : null,
          maxParticipantsCount: maxParticipantsCount ? Number(maxParticipantsCount) : null,
          location: req.body.location ? JSON.parse(req.body.location) : null,
          imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        };

        const event = await Event.create(eventData);

        // Если мероприятие создано для группы, уведомляем всех участников
        if (groupId) {
          const members = await GroupMember.findAll({
            where: { groupId },
            attributes: ['userId'],
            raw: true
          });

          if (members.length > 0) {
            const userIds = members.map((m) => m.userId);

            await Promise.all(
              userIds.map((userId) =>
                createNotification({
                  userId,
                  type: NotificationType.GROUP_EVENT_CREATED,
                  title: 'Новое групповое мероприятие',
                  content: `В группе создано новое мероприятие "${title}", в котором вы можете принять участие`,
                  eventId: event.id,
                  groupId
                })
              )
            );
          }
        }
        res.status(201).json(event);
      } catch (error) {
        handleControllerError(res, error, 'Ошибка при создании события');
      }
    });
  },

  getEvents: async (req: Request, res: Response) => {
    try {
      const where: any = {};
      // if (!req.user) where.isLocal = false; // Только публичные для неавторизованных

      const events = await Event.findAll({ where });
      return res.json(events);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении событий');
    }
  },

  getEvent: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }
      res.json(event);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении события');
    }
  },

  updateEvent: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }
      const eventData = event.dataValues;

      const isAdmin = await EventAdmin.findOne({
        where: { eventId: eventData.id, userId: req.user?.id }
      });

      if (eventData.organizerId !== req.user?.id && !isAdmin) {
        return res.status(403).json({ message: 'Нет доступа' });
      }
      await event.update(req.body);

      // Получаем всех зарегистрированных пользователей
      const registrations = await EventRegistration.findAll({
        where: { eventId: event.id },
        attributes: ['userId'],
        raw: true
      });

      // Создаем уведомления для всех участников
      if (registrations.length > 0) {
        const userIds = registrations.map((r) => r.userId);

        await Promise.all(
          userIds.map((userId) =>
            createNotification({
              userId,
              type: NotificationType.EVENT_UPDATE,
              title: 'Изменение мероприятия',
              content: `В мероприятии "${event.title}", на которое вы зарегистрированы, произошли изменения`,
              eventId: event.id
            })
          )
        );
      }
      res.json(event);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при обновлении события');
    }
  },

  deleteEvent: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      if (event.organizerId !== req.user?.id) {
        return res.status(403).json({ message: 'Только организатор может удалить мероприятие' });
      }

      // Получаем всех зарегистрированных пользователей перед удалением
      const registrations = await EventRegistration.findAll({
        where: { eventId: event.id },
        attributes: ['userId']
      });

      const eventTitle = event.dataValues.title;
      await event.destroy();

      // Создаем уведомления для всех участников
      if (registrations.length > 0) {
        const userIds = registrations.map((r) => r.userId);

        await Promise.all(
          userIds.map((userId) =>
            createNotification({
              userId,
              type: NotificationType.EVENT_DELETE,
              title: 'Мероприятие отменено',
              content: `Мероприятие "${eventTitle}", на которое вы были зарегистрированы, было отменено`,
              eventId: event.id
            })
          )
        );
      }

      res.json({ message: 'Мероприятие удалено' });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при удалении события');
    }
  },

  addAdmin: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      if (event.organizerId !== req.user?.id) {
        return res
          .status(403)
          .json({ message: 'Только организатор может добавлять администраторов' });
      }

      const { userId } = req.body;
      await EventAdmin.create({ eventId: event.id, userId });

      const organizer = await User.findByPk(req.user.id, { raw: true });
      await createNotification({
        userId,
        type: NotificationType.ADMIN_ASSIGNED,
        title: 'Новые права администратора',
        content: `Пользователь ${
          organizer?.name || 'Аноним'
        } назначил вас администратором мероприятия "${event.title}"`,
        eventId: event.id
      });
      res.status(201).json({ message: 'Администратор добавлен' });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при добавлении администратора');
    }
  },

  removeAdmin: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      if (event.organizerId !== req.user?.id) {
        return res
          .status(403)
          .json({ message: 'Только организатор может удалять администраторов' });
      }

      await EventAdmin.destroy({
        where: {
          eventId: req.params.id,
          userId: req.params.userId
        }
      });
      res.json({ message: 'Администратор удален' });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при удалении администратора');
    }
  },

  getAdmins: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const admins = await EventAdmin.findAll({
        where: {
          eventId: req.params.id
        },
        include: [
          {
            model: User,
            as: 'user'
          }
        ]
      });

      res.json(admins);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении администраторов');
    }
  },

  registerForEvent: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }
      const eventData = event.dataValues;

      if (
        eventData.maxParticipantsCount &&
        eventData.participantsCount >= eventData.maxParticipantsCount
      ) {
        return res.status(400).json({ message: 'Достигнуто максимальное количество участников' });
      }

      const isBanned = await Blacklist.findOne({
        where: {
          organizerId: eventData.organizerId,
          bannedUserId: req.user?.id
        }
      });

      if (isBanned) {
        return res.status(403).json({ message: 'Вы в черном списке организатора' });
      }

      await EventRegistration.create({
        eventId: eventData.id,
        userId: req.user!.id
      });

      await event.increment('participantsCount');

      const user = await User.findByPk(req.user!.id, { raw: true });
      await createNotification({
        userId: eventData.organizerId,
        type: NotificationType.EVENT_REGISTRATION,
        title: 'Новая регистрация на мероприятие',
        content: `Пользователь ${user?.name || 'Аноним'} зарегистрировался на ваше мероприятие "${
          eventData.title
        }"`,
        eventId: eventData.id
      });
      res.status(201).json(event);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при регистрации на событие');
    }
  },

  cancelRegistration: async (req: Request, res: Response) => {
    try {
      const registration = await EventRegistration.findOne({
        where: {
          eventId: req.params.id,
          userId: req.params?.user_id
        }
      });

      if (!registration) {
        return res.status(404).json({ message: 'Запись не найдена' });
      }

      const event = await Event.findByPk(req.params.id);
      await registration.destroy();

      if (event) {
        await event.decrement('participantsCount');
        const user = await User.findByPk(req.params?.user_id, { raw: true });
        await createNotification({
          userId: event.dataValues.organizerId,
          type: NotificationType.EVENT_CANCEL,
          title: 'Отмена регистрации на мероприятие',
          content: `Пользователь ${
            user?.name || 'Аноним'
          } отменил регистрацию на ваше мероприятие "${event.dataValues.title}"`,
          eventId: event.dataValues.id
        });
      }

      res.json({ message: 'Запись отменена' });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при отмене регистрации');
    }
  },

  getParticipants: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const participants = await EventRegistration.findAll({
        where: {
          eventId: req.params.id,
          status: 'registered'
        },
        include: [
          {
            model: User,
            as: 'user'
          }
        ]
      });

      res.json(participants);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении участников');
    }
  },

  toggleFavourite: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id);
      const userId = req.user?.id;
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      await event.update({
        isFavourite: !event.dataValues.isFavourite
      });

      res.status(201).json(event);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при изменении статуса "избранное"');
    }
  }
};

export default eventController;
