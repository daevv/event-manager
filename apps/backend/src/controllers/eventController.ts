import { Request, Response } from 'express';
import Event from '../models/event';
import EventAdmin from '../models/eventAdmin';
import EventRegistration from '../models/eventRegistration';
import Blacklist from '../models/blacklist';
import User from '@/models/user';
import multer from 'multer';
import * as path from 'path';

interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Предполагаем, что req.user имеет поле id типа string (UUID)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для сохранения изображений
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Только изображения формата JPEG или PNG!'));
  }
}).single('image'); // 'image' - имя поля формы

// Создание события
export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const {
      title,
      description,
      dateTime,
      isLocal,
      groupId,
      category,
      isFree,
      price,
      maxParticipantsCount,
      placeId
    } = req.body;
    const isLocalBool = isLocal === 'true' ? true : isLocal === 'false' ? false : Boolean(isLocal);
    const isFreeBool = isFree === 'true' ? true : isFree === 'false' ? false : Boolean(isFree);

    if (isLocalBool && !groupId) {
      console.log('какого хуя');
      return res.status(400).json({ message: 'groupId обязателен для локальных мероприятий' });
    }

    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Путь к загруженному файлу

      const event = await Event.create({
        title,
        description,
        dateTime,
        organizerId: req.user?.id as string,
        isLocal: isLocalBool,
        groupId,
        category,
        isFree: isFreeBool,
        price,
        maxParticipantsCount,
        placeId,
        imageUrl // Добавляем путь к изображению
      });

      res.status(201).json(event);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Ошибка при создании события', error: (error as Error).message });
    }
  });
};

// Получение списка событий
export const getEvents = async (req: AuthenticatedRequest, res: Response) => {
  const where: any = { isLocal: true };

  if (!req.user) where.isLocal = false; // Только публичные для неавторизованных

  try {
    const events = await Event.findAll({ where });
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при получении событий', error: (error as Error).message });
  }
};

// Получение одного события
export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при получении события', error: (error as Error).message });
  }
};

// Обновление события
export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    const isAdmin = await EventAdmin.findOne({
      where: { eventId: event.id, userId: req.user?.id }
    });

    if (event.organizerId !== req.user?.id && !isAdmin) {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при обновлении события', error: (error as Error).message });
  }
};

// Удаление события
export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    if (event.organizerId !== req.user?.id) {
      return res.status(403).json({ message: 'Только организатор может удалить мероприятие' });
    }

    await event.destroy();
    res.json({ message: 'Мероприятие удалено' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при удалении события', error: (error as Error).message });
  }
};

// Добавление администратора
export const addAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    if (event.organizerId !== req.user?.id) {
      return res
        .status(403)
        .json({ message: 'Только организатор может добавлять администраторов' });
    }

    const { userId } = req.body;
    await EventAdmin.create({ eventId: event.id, userId });
    res.status(201).json({ message: 'Администратор добавлен' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при добавлении администратора', error: (error as Error).message });
  }
};

// Удаление администратора
export const removeAdmin = async (
  req: AuthenticatedRequest & { params: { id: string; userId: string } },
  res: Response
) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    if (event.organizerId !== req.user?.id) {
      return res.status(403).json({ message: 'Только организатор может удалять администраторов' });
    }

    await EventAdmin.destroy({ where: { eventId: req.params.id, userId: req.params.userId } });
    res.json({ message: 'Администратор удален' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при удалении администратора', error: (error as Error).message });
  }
};

// Регистрация на событие
export const registerForEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    if (event.maxParticipantsCount && event.participantsCount >= event.maxParticipantsCount) {
      return res.status(400).json({ message: 'Достигнуто максимальное количество участников' });
    }

    const isBanned = await Blacklist.findOne({
      where: { organizerId: event.organizerId, bannedUserId: req.user?.id }
    });
    if (isBanned) return res.status(403).json({ message: 'Вы в черном списке организатора' });

    await EventRegistration.create({ eventId: event.id, userId: req.user!.id });
    await event.increment('participantsCount'); // Увеличиваем счетчик участников
    res.status(201).json({ message: 'Вы записаны на мероприятие' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при регистрации на событие', error: (error as Error).message });
  }
};

// Отмена регистрации
export const cancelRegistration = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const registration = await EventRegistration.findOne({
      where: { eventId: req.params.id, userId: req.user?.id }
    });
    if (!registration) return res.status(404).json({ message: 'Запись не найдена' });

    const event = await Event.findByPk(req.params.id);
    await registration.destroy();
    if (event) await event.decrement('participantsCount'); // Уменьшаем счетчик участников
    res.json({ message: 'Запись отменена' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при отмене регистрации', error: (error as Error).message });
  }
};

// Получение списка участников
export const getParticipants = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

    const participants = await EventRegistration.findAll({
      where: { eventId: req.params.id, status: 'registered' },
      include: [{ model: User, as: 'user' }]
    });
    res.json(participants);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Ошибка при получении участников', error: (error as Error).message });
  }
};
