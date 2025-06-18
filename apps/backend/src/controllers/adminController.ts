import User from '@/models/user';
import Event from '@/models/event';
import Comment from '@/models/comment'; // Предполагается, что есть модель Comment
import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Log from '@/models/log';
import { logger } from '@/services/logger';

// Интерфейс для унифицированных ответов
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Middleware для проверки прав администратора
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Доступ запрещен: требуется роль администратора'
    });
  }
  next();
};

// Получение списка пользователей с поддержкой пагинации
// Получение списка пользователей с поддержкой пагинации
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'firstName', 'secondName', 'email', 'isBlocked', 'createdAt'], // Выбираем только нужные поля
      offset: (pageNum - 1) * limitNum,
      limit: limitNum,
      include: [
        {
          model: Event,
          as: 'organizedEvents', // Псевдоним для мероприятий, где пользователь - организатор
          attributes: ['id'],
          where: { organizerId: { [Op.col]: 'User.id' } }, // Условие для организатора
          required: false // LEFT JOIN, чтобы включать пользователей без мероприятий
        }
      ]
    });

    const response: ApiResponse = {
      success: true,
      data: {
        users: rows,
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum)
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении пользователей'
    });
  }
};

// Блокировка пользователя
export const blockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    await user.update({ isBlocked: true });
    await user.save();

    return res.json({
      success: true,
      message: 'Пользователь успешно заблокирован'
    });
  } catch (error) {
    console.error('Ошибка при блокировке пользователя:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка сервера при блокировке пользователя'
    });
  }
};

// Получение списка комментариев с поддержкой пагинации
export const getComments = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', eventId } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const where: any = {};
    if (eventId) {
      where.eventId = eventId; // Фильтрация по мероприятию, если указано
    }

    const { count, rows } = await Comment.findAndCountAll({
      attributes: ['id', 'text', 'userId', 'eventId', 'rating'],
      where,
      offset: (pageNum - 1) * limitNum,
      limit: limitNum,
      include: [
        { model: User, as: 'user', attributes: ['firstName'] }, // Подгружаем имя пользователя
        { model: Event, as: 'event', attributes: ['title'] } // Подгружаем название мероприятия
      ]
    });

    const response: ApiResponse = {
      success: true,
      data: {
        comments: rows,
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum)
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении комментариев'
    });
  }
};

// Удаление комментария
export const removeComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Комментарий не найден'
      });
    }

    await comment.destroy();

    return res.json({
      success: true,
      message: 'Комментарий успешно удален'
    });
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка сервера при удалении комментария'
    });
  }
};

// Получение списка мероприятий с поддержкой пагинации и фильтров
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const where: any = {};
    if (status) {
      where.eventStatus = status; // Фильтрация по статусу (например, 'ACTIVE', 'BANNED')
    }

    const { count, rows } = await Event.findAndCountAll({
      attributes: ['id', 'title', 'dateTime', 'eventStatus', 'organizerId'],
      where,
      offset: (pageNum - 1) * limitNum,
      limit: limitNum
    });

    const response: ApiResponse = {
      success: true,
      data: {
        events: rows,
        total: count,
        page: pageNum,
        pages: Math.ceil(count / limitNum)
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Ошибка при получении мероприятии:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении мероприятий'
    });
  }
};

// Отмена (блокировка) мероприятия
export const cancelEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Мероприятие не найдено'
      });
    }

    await event.update({ eventStatus: 'BANNED' });
    await event.save();

    return res.json({
      success: true,
      message: 'Мероприятие успешно заблокировано'
    });
  } catch (error) {
    console.error('Ошибка при блокировке мероприятия:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка сервера при блокировке мероприятия'
    });
  }
};

export const getLogs = async (req: Request, res: Response) => {
  try {
    // Получаем параметры запроса
    const { userId, method, status, startDate, endDate, page = 1, limit = 50 } = req.query;

    // Формируем условия фильтрации
    const where: any = { level: 'http' };

    if (userId) where.userId = userId;
    if (method) where.method = method;
    if (status) where.status = Number(status);

    // Фильтрация по дате
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate as string);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate as string);
    }

    // Вычисляем offset для пагинации
    const offset = (Number(page) - 1) * Number(limit);

    // Получаем логи с учетом фильтров
    const { count, rows } = await Log.findAndCountAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch logs', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs',
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// Применение middleware ко всем маршрутам
export const adminRoutes = {
  getUsers: [requireAdmin, getUsers],
  blockUser: [requireAdmin, blockUser],
  getComments: [requireAdmin, getComments],
  removeComment: [requireAdmin, removeComment],
  getEvents: [requireAdmin, getEvents],
  cancelEvent: [requireAdmin, cancelEvent],
  getLogs: [requireAdmin, getLogs]
};
