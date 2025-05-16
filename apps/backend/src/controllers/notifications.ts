// controllers/notification.controller.ts
import { Request, Response } from 'express';
import {
  getUnreadCount as getUnreadCountService,
  getUserNotifications as getNotificationsService,
  markAllAsRead as markAllAsReadService,
  markAsRead as markAsReadService
} from '../services/notificationService';
import { logger } from '@/services/logger';

const handleControllerError = (res: Response, error: unknown, defaultMessage: string) => {
  const message = error instanceof Error ? error.message : defaultMessage;
  logger.error(message, { error });
  res.status(500).json({ message, error: message });
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await getNotificationsService(req.user!.id);
    res.json(notifications);
  } catch (error) {
    handleControllerError(res, error, 'Ошибка при получении уведомлений');
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await markAsReadService(parseInt(req.params.id), req.user!.id);
    res.json(notification);
  } catch (error) {
    handleControllerError(res, error, 'Ошибка при обновлении уведомления');
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await markAllAsReadService(req.user!.id);
    res.json({ message: 'Все уведомления помечены как прочитанные' });
  } catch (error) {
    handleControllerError(res, error, 'Ошибка при обновлении уведомлений');
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await getUnreadCountService(req.user!.id);
    res.json({ count });
  } catch (error) {
    handleControllerError(res, error, 'Ошибка при получении количества уведомлений');
  }
};
