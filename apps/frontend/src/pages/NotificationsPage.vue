<template>
  <div class="notifications-page">
    <h1 class="page-title">Уведомления ({{ unreadCount }})</h1>

    <div v-if="notifications.length" class="notifications-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification-item', `type-${notification.type}`, { unread: !notification.read }]"
        @click="markAsRead(notification)"
      >
        <div class="notification-header">
          <span class="notification-type">{{ typeLabels[notification.type] }}</span>
          <span class="notification-date">{{ formatDate(notification.createdAt) }}</span>
        </div>

        <h3 class="notification-title">{{ notification.title }}</h3>
        <p class="notification-content">{{ notification.content }}</p>

        <button
          v-if="notification.type === 'event_completed' && notification.eventId"
          class="action-button"
          @click.stop="openRatingModal(notification.eventId)"
        >
          Оценить мероприятие
        </button>
      </div>
    </div>
    <ZeroBlock v-else title="Уведомлений нет" />

    <!-- Модальное окно оценки -->
    <RatingModal
      v-if="showRatingModal"
      :event-id="currentEventId"
      @close="closeRatingModal"
      @submitted="handleRatingSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import RatingModal from '@/widgets/modals/RatingModal.vue';
import { useToast } from 'vue-toastification';
import { useNotificationStore } from '@/shared/stores/notificationStore';
import { storeToRefs } from 'pinia';
import ZeroBlock from '@/shared/components/ZeroBlock.vue';

const toast = useToast();
const notificationStore = useNotificationStore();
const { notifications, unreadCount } = storeToRefs(notificationStore);

const showRatingModal = ref(false);
const currentEventId = ref<string | null>(null);

const typeLabels = {
  event_update: 'Обновление',
  event_delete: 'Удаление',
  admin_assigned: 'Назначение',
  event_registration: 'Запись',
  event_cancel: 'Отмена',
  event_completed: 'Завершение',
  group_added: 'Группа',
  group_event_created: 'Групповое мероприятие'
} as const; // as const для точной типизации

// Тип для уведомления
interface Notification {
  id: number;
  type: keyof typeof typeLabels;
  title: string;
  content: string;
  read: boolean;
  eventId?: string;
  createdAt: string;
}

onMounted(async () => {
  await Promise.all([notificationStore.fetchNotifications(), notificationStore.fetchUnreadCount()]);
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const openRatingModal = (eventId: string) => {
  currentEventId.value = eventId;
  showRatingModal.value = true;
};

const closeRatingModal = () => {
  showRatingModal.value = false;
};

const handleRatingSubmit = () => {
  toast.success('Спасибо за вашу оценку!');
};

const markAsRead = async (notificationId: number) => {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (error) {
    console.error('Ошибка при отметке уведомления как прочитанного:', error);
    toast.error('Не удалось обновить статус уведомления');
  }
};
</script>

<style scoped>
.notifications-page {
  max-width: 800px;
  min-height: calc(100vh - 380px);
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.notification-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
}

.notification-item.unread .notification-title {
  font-weight: bold;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.notification-type {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.notification-date {
  color: #7f8c8d;
}

.notification-title {
  margin: 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.notification-content {
  margin: 0.5rem 0;
  color: #34495e;
  line-height: 1.5;
}

.action-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #2980b9;
}

/* Цвета для разных типов уведомлений */
.type-event_update {
  border-color: #3498db;
}
.type-event_update .notification-type {
  background: #e1f0fa;
  color: #3498db;
}

.type-event_delete {
  border-color: #e74c3c;
}
.type-event_delete .notification-type {
  background: #fae1e1;
  color: #e74c3c;
}

.type-admin_assigned {
  border-color: #2ecc71;
}
.type-admin_assigned .notification-type {
  background: #e1fae8;
  color: #2ecc71;
}

.type-event_registration {
  border-color: #9b59b6;
}
.type-event_registration .notification-type {
  background: #f1e1fa;
  color: #9b59b6;
}

.type-event_cancel {
  border-color: #f39c12;
}
.type-event_cancel .notification-type {
  background: #fef5e7;
  color: #f39c12;
}

.type-event_completed {
  border-color: #1abc9c;
}
.type-event_completed .notification-type {
  background: #e1faf4;
  color: #1abc9c;
}

@media (max-width: 768px) {
  .notifications-page {
    padding: 1rem;
  }

  .notification-item {
    padding: 1rem;
  }
}
</style>
