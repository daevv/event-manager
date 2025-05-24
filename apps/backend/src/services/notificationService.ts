import Notification from '../models/notification';
import Event from '@/models/event';
import { Optional } from 'sequelize';
import { getSocketIOInstance } from '@/services/socket';
import UserGroup from '@/models/userGroup';

export const createNotification = async (params: Optional<any, string>) => {
  console.log(params);
  const notification = await Notification.create(params);
  // Отправляем уведомление через WebSocket
  const notifactionData = notification.dataValues;
  await sendRealTimeNotification(params.userId, {
    id: notifactionData.id,
    type: notifactionData.type,
    title: notifactionData.title,
    content: notifactionData.content,
    read: notifactionData.read,
    eventId: notifactionData.eventId,
    groupId: notifactionData.groupId
  });

  return notification;
};

export const getUserNotifications = async (userId: string) => {
  return Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Event,
        as: 'event',
        attributes: ['id', 'title'],
        required: false
      },
      {
        model: UserGroup,
        as: 'group',
        attributes: ['id', 'name'],
        required: false
      }
    ]
  });
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, userId }
  });

  if (!notification) {
    throw new Error('Уведомление не найдено');
  }

  return notification.update({ read: true });
};

export const markAllAsRead = async (userId: string) => {
  return Notification.update(
    { read: true },
    {
      where: {
        userId,
        read: false
      }
    }
  );
};

export const getUnreadCount = async (userId: string) => {
  return Notification.count({
    where: {
      userId,
      read: false
    }
  });
};

export const sendRealTimeNotification = async (userId: string, notification: any) => {
  try {
    const io = getSocketIOInstance();
    console.log(notification);
    io.to(`user_${userId}`).emit('new_notification', notification);
  } catch (error) {
    console.error('Ошибка отправки уведомления через WebSocket:', error);
  }
};
