import { Request, Response } from 'express';
import path from 'path';
import multer from 'multer';
import { sequelize } from '@/config/db';
import Event from '../models/event';
import EventAdmin from '../models/eventAdmin';
import EventRegistration from '../models/eventRegistration';
import Blacklist from '../models/blacklist';
import User from '@/models/user';
import UserGroup from '@/models/userGroup';
import { logger } from '@/services/logger';
import { createNotification } from '@/services/notificationService';
import { NotificationType } from '@/models/notification';
import { Op } from 'sequelize';

// Конфигурация Multer для загрузки файлов
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
    fileFilter: (req, file, cb) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (validTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Только изображения формата JPEG или PNG'));
      }
    }
  }).single('image');
};

const upload = configureMulter();

// Валидация данных события
const validateEventData = (req: Request) => {
  const { title, description, dateTime, isLocal, groupId, location, categories } = req.body;

  if (!title || !description || !dateTime) {
    throw new Error('Обязательные поля: title, description, dateTime');
  }

  if (isLocal === 'true' && !groupId) {
    throw new Error('groupId обязателен для локальных мероприятий');
  }

  if (location) {
    try {
      console.log(location);
      const parsedLocation = JSON.parse(location);
      if (!parsedLocation?.lat || !parsedLocation?.lng || !parsedLocation?.address) {
        throw new Error('Локация должна содержать lat, lng и address');
      }
    } catch (e) {
      logger.warn('Invalid location JSON', { location, error: e });
      throw new Error('Некорректный JSON локации');
    }
  }

  if (categories) {
    try {
      JSON.parse(categories);
    } catch (e) {
      logger.warn('Invalid categories JSON', { categories, error: e });
      throw new Error('Некорректный JSON категорий');
    }
  }
};

// Обработка ошибок
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
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Ошибка загрузки файла: ' + err.message });
      }
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      try {
        if (!req.user?.id) {
          return res.status(401).json({ message: 'Требуется авторизация' });
        }

        validateEventData(req);

        const {
          title,
          description,
          dateTime,
          isLocal,
          groupId,
          categories,
          price,
          maxParticipantsCount,
          location,
          meetingUrl,
          isOnline
        } = req.body;

        const eventData = {
          title,
          description,
          dateTime: new Date(dateTime),
          organizerId: req.user.id,
          isLocal: isLocal === 'true',
          groupId: groupId || null,
          categories: categories ? JSON.parse(categories) : [],
          price: price ? Number(price) : null,
          maxParticipantsCount: maxParticipantsCount ? Number(maxParticipantsCount) : null,
          location: location ? JSON.parse(location) : null,
          imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
          isOnline: isOnline === 'true',
          meetingUrl: meetingUrl
        };

        const event = await Event.create(eventData);
        const eventValues = event.dataValues;

        // Уведомления для участников группы
        if (groupId) {
          const group = await UserGroup.findByPk(groupId);
          if (!group) {
            return res.status(404).json({ message: 'Группа не найдена' });
          }

          const groupValues = group.dataValues;
          const members = groupValues.members || [];
          if (members.length > 0) {
            await Promise.all(
              members.map((userId: string) =>
                createNotification({
                  userId,
                  type: NotificationType.GROUP_EVENT_CREATED,
                  title: 'Новое групповое мероприятие',
                  content: `В группе "${groupValues.name}" создано новое мероприятие "${title}"`,
                  eventId: eventValues.id,
                  groupId
                })
              )
            );
          }
        }

        return res.status(201).json(eventValues);
      } catch (error) {
        handleControllerError(res, error, 'Ошибка при создании события');
      }
    });
  },

  getEvents: async (req: Request, res: Response) => {
    try {
      const where: any = {
        eventStatus: {
          [Op.not]: 'BANNED' // Исключаем события со статусом BANNED
        }
      };
      if (!req.user?.id) {
        where.isLocal = false; // Только публичные события для неавторизованных
      }

      const events = await Event.findAll({
        where
      });

      return res.json(events.map((event) => event.dataValues));
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении событий');
    }
  },

  getEvent: async (req: Request, res: Response) => {
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [{ model: User, as: 'organizer', attributes: ['id', 'firstName', 'secondName'] }]
      });

      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      return res.json(event.dataValues);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении события');
    }
  },

  updateEvent: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      const isAdmin = await EventAdmin.findOne({
        where: { eventId: eventValues.id, userId: req.user.id }
      });

      if (eventValues.organizerId !== req.user.id && !isAdmin) {
        return res.status(403).json({ message: 'Нет доступа для редактирования' });
      }

      // Валидация данных, если они переданы
      if (req.body.location) {
        try {
          const parsedLocation = JSON.parse(req.body.location);
          if (!parsedLocation?.lat || !parsedLocation?.lng || !parsedLocation?.address) {
            throw new Error('Локация должна содержать lat, lng и address');
          }
        } catch (e) {
          logger.warn('Invalid location JSON', { location: req.body.location, error: e });
          throw new Error('Некорректный JSON локации');
        }
      }

      const updateData = {
        ...req.body,
        categories: req.body.categories ? JSON.parse(req.body.categories) : eventValues.categories,
        location: req.body.location ? JSON.parse(req.body.location) : eventValues.location
      };

      await event.update(updateData);
      const updatedEvent = event.dataValues;

      // Уведомления для зарегистрированных участников
      const registrations = await EventRegistration.findAll({
        where: { eventId: eventValues.id, status: 'registered' },
        attributes: ['userId']
      });

      if (registrations.length > 0) {
        await Promise.all(
          registrations.map((reg) =>
            createNotification({
              userId: reg.dataValues.userId,
              type: NotificationType.EVENT_UPDATE,
              title: 'Изменение мероприятия',
              content: `Мероприятие "${eventValues.title}" было обновлено`,
              eventId: eventValues.id
            })
          )
        );
      }

      return res.json(updatedEvent);
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при обновлении события');
    }
  },

  deleteEvent: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      if (eventValues.organizerId !== req.user.id) {
        return res.status(403).json({ message: 'Только организатор может удалить мероприятие' });
      }

      const registrations = await EventRegistration.findAll({
        where: { eventId: eventValues.id, status: 'registered' },
        attributes: ['userId']
      });

      await sequelize.transaction(async (t) => {
        await event.destroy({ transaction: t });

        if (registrations.length > 0) {
          await Promise.all(
            registrations.map((reg) =>
              createNotification({
                userId: reg.dataValues.userId,
                type: NotificationType.EVENT_DELETE,
                title: 'Мероприятие отменено',
                content: `Мероприятие "${eventValues.title}" было отменено`,
                eventId: eventValues.id,
                transaction: t
              })
            )
          );
        }
      });

      return res.json({ message: 'Мероприятие удалено' });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при удалении события');
    }
  },

  addAdmin: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      if (eventValues.organizerId !== req.user.id) {
        return res
          .status(403)
          .json({ message: 'Только организатор может добавлять администраторов' });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'email обязателен' });
      }

      const user = await User.findOne({ where: { email }, raw: true });
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const existingAdmin = await EventAdmin.findOne({
        where: { eventId: eventValues.id, userId: user.id }
      });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Пользователь уже является администратором' });
      }

      await EventAdmin.create({ eventId: eventValues.id, userId: user.id });

      await createNotification({
        userId: user.id,
        type: NotificationType.ADMIN_ASSIGNED,
        title: 'Назначение администратором',
        content: `Вы назначены администратором мероприятия "${eventValues.title}"`,
        eventId: eventValues.id
      });

      return res.status(201).json({ message: 'Администратор добавлен' });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при добавлении администратора');
    }
  },

  removeAdmin: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      if (eventValues.organizerId !== req.user.id) {
        return res
          .status(403)
          .json({ message: 'Только организатор может удалять администраторов' });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'email обязателен' });
      }
      const user = await User.findOne({ where: { email }, raw: true });
      if (!user) {
        return res.status(400).json({ message: 'Пользователь с таким email не зарегистрирован' });
      }
      const deleted = await EventAdmin.destroy({
        where: { eventId: eventValues.id, userId: user.id }
      });

      if (!deleted) {
        return res.status(404).json({ message: 'Администратор не найден' });
      }

      return res.json({ message: 'Администратор удален' });
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
        where: { eventId: req.params.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'secondName', 'email']
          }
        ]
      });

      return res.json(admins.map((admin) => admin.dataValues));
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении администраторов');
    }
  },

  registerForEvent: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      if (
        eventValues.maxParticipantsCount &&
        eventValues.participantsCount >= eventValues.maxParticipantsCount
      ) {
        return res.status(400).json({ message: 'Достигнуто максимальное количество участников' });
      }

      const isBanned = await Blacklist.findOne({
        where: { organizerId: eventValues.organizerId, bannedUserId: req.user.id }
      });

      if (isBanned) {
        return res.status(403).json({ message: 'Вы в черном списке организатора' });
      }

      const existingRegistration = await EventRegistration.findOne({
        where: { eventId: eventValues.id, userId: req.user.id }
      });
      if (existingRegistration) {
        return res.status(400).json({ message: 'Вы уже зарегистрированы на это мероприятие' });
      }

      await sequelize.transaction(async (t) => {
        await EventRegistration.create(
          { eventId: eventValues.id, userId: req.user!.id },
          { transaction: t }
        );
        await event.increment('participantsCount', { transaction: t });

        await createNotification({
          userId: eventValues.organizerId,
          type: NotificationType.EVENT_REGISTRATION,
          title: 'Новая регистрация',
          content: `Пользователь ${
            req.user.firstName || 'Аноним'
          } зарегистрировался на мероприятие "${eventValues.title}"`,
          eventId: eventValues.id,
          transaction: t
        });
      });

      return res.status(201).json({ message: 'Регистрация успешна', event: eventValues });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при регистрации на событие');
    }
  },

  cancelRegistration: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }
       const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'email обязателен' });
      }

      const user = await User.findOne({ where: { email }, raw: true });
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const registration = await EventRegistration.findOne({
        where: { eventId: req.params.id, userId: user.id }
      });

      if (!registration) {
        return res.status(404).json({ message: 'Регистрация не найдена' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      await sequelize.transaction(async (t) => {
        await registration.destroy({ transaction: t });
        await event.decrement('participantsCount', { transaction: t });

        await createNotification({
          userId: eventValues.organizerId,
          type: NotificationType.EVENT_CANCEL,
          title: 'Отмена регистрации',
          content: `Пользователь ${
            req.user.firstName || 'Аноним'
          } отменил регистрацию на мероприятие "${eventValues.title}"`,
          eventId: eventValues.id,
          transaction: t
        });
      });

      return res.json({ message: 'Регистрация отменена' });
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
        where: { eventId: req.params.id, status: 'registered' },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'secondName', 'email']
          }
        ]
      });

      return res.json(participants.map((p) => p.dataValues));
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при получении участников');
    }
  },

  toggleFavourite: async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Мероприятие не найдено' });
      }

      const eventValues = event.dataValues;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const userValues = user.dataValues;
      const favourites = userValues.favourites || [];
      const isFavourite = favourites.includes(eventValues.id);

      await user.update({
        favourites: isFavourite
          ? favourites.filter((id: string) => id !== eventValues.id)
          : [...favourites, eventValues.id]
      });

      return res.json({
        message: `Мероприятие ${isFavourite ? 'удалено из' : 'добавлено в'} избранное`
      });
    } catch (error) {
      handleControllerError(res, error, 'Ошибка при изменении статуса избранного');
    }
  }
};

export default eventController;
