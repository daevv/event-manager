<template>
  <div class="notifications-page">
    <h1 class="page-title">Уведомления ({{ unreadCount }})</h1>

    <div class="notifications-list">
      <div
        v-for="notification in sortedNotifications"
        :key="notification.id"
        :class="['notification-item', `type-${notification.type}`, { unread: !notification.read }]"
        @click="markAsRead(notification)"
      >
        <div class="notification-header">
          <span class="notification-type">{{ typeLabels[notification.type] }}</span>
          <span class="notification-date">{{ formatDate(notification.date) }}</span>
        </div>

        <h3 class="notification-title">{{ notification.title }}</h3>
        <p class="notification-content">{{ notification.content }}</p>

        <button
          v-if="notification.type === 'event_completed'"
          class="action-button"
          @click="openRatingModal(notification.eventId)"
        >
          Оценить мероприятие
        </button>
      </div>
    </div>

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
import { computed, ref } from 'vue';
import RatingModal from '@/widgets/RatingModal.vue';
import { useToast } from 'vue-toastification';

// Типы уведомлений
type NotificationType =
  | 'event_update'
  | 'event_delete'
  | 'admin_assigned'
  | 'event_registration'
  | 'event_cancel'
  | 'event_completed';

interface Notification {
  id: number;
  type: NotificationType;
  date: Date;
  title: string;
  content: string;
  eventId?: string;
  read: boolean;
}

const toast = useToast();

// Моковые данные - замените на реальные
const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'event_update',
    date: new Date('2023-05-15'),
    title: 'Изменение в мероприятии',
    content: 'В мероприятии "Городская экскурсия" изменилось время проведения',
    read: false
  },
  {
    id: 2,
    type: 'event_completed',
    date: new Date('2023-05-10'),
    title: 'Мероприятие завершено',
    content: 'Мероприятие "Мастер-класс по фотографии" успешно завершено',
    eventId: '238ed568-abae-4bfb-a16e-21c4d4a70e08',
    read: false
  },
  {
    id: 3,
    type: 'admin_assigned',
    date: new Date('2023-05-05'),
    title: 'Новые права',
    content: 'Вас назначили администратором группы "Культурные события"',
    read: false
  }
]);

const showRatingModal = ref(false);
const currentEventId = ref<string | null>(null);

const typeLabels = {
  event_update: 'Обновление',
  event_delete: 'Удаление',
  admin_assigned: 'Назначение',
  event_registration: 'Запись',
  event_cancel: 'Отмена',
  event_completed: 'Завершение'
};

// Сортируем по дате (новые сверху)
const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => b.date.getTime() - a.date.getTime());
});

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
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

const markAsRead = (notification: Notification) => {
  console.log(notification);
};
</script>

<style scoped>
.notifications-page {
  max-width: 800px;
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
