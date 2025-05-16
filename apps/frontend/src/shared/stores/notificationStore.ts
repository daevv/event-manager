// stores/notification.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosInstance from '@/shared/utilities/axiosInstance';

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  read: boolean;
  eventId?: string;
  groupId?: string;
  createdAt: string;
  updatedAt: string;
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      notifications.value = response.data;
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/notifications/unread-count');
      unreadCount.value = response.data.count;
    } catch (error) {
      console.error('Ошибка при загрузке количества непрочитанных уведомлений:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      const notification = notifications.value.find((n) => n.id === id);
      if (notification) {
        notification.read = true;
      }
      if (unreadCount.value > 0) {
        unreadCount.value--;
      }
    } catch (error) {
      console.error('Ошибка при обновлении уведомления:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch('/notifications/mark-all-read');
      notifications.value.forEach((n) => {
        n.read = true;
      });
      unreadCount.value = 0;
    } catch (error) {
      console.error('Ошибка при обновлении уведомлений:', error);
    }
  };

  const addNotification = (notification: Notification) => {
    notifications.value.unshift(notification);
  };

  const incrementUnreadCount = () => {
    unreadCount.value += 1;
  };

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    incrementUnreadCount
  };
});
