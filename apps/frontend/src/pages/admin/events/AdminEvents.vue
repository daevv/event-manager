<!-- src/pages/admin/AdminEvents.vue -->
<template>
  <div class="admin-events">
    <div class="table-container">
      <table class="events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Дата/Время</th>
            <th>Организатор</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.id }}</td>
            <td>{{ event.title }}</td>
            <td>{{ formatDateTime(event.dateTime) }}</td>
            <td>{{ event.organizerId }}</td>
            <td>
              <span
                :class="['status-badge', event.eventStatus === 'BANNED' ? 'blocked' : 'active']"
              >
                {{ event.eventStatus === 'BANNED' ? 'Заблокировано' : 'Активно' }}
              </span>
            </td>
            <td>
              <button
                v-if="event.eventStatus !== 'BANNED'"
                @click="cancelEvent(event.id)"
                class="action-button cancel"
              >
                Отменить
              </button>
              <span v-else class="text-gray">Уже отменено</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Пагинация -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        Назад
      </button>
      <span class="pagination-info">Страница {{ currentPage }} из {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Вперед
      </button>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import axiosInstance from '@/shared/utilities/axiosInstance';

// Типы для данных с бэкенда
interface Event {
  id: number;
  title: string;
  dateTime: string;
  eventStatus: string;
  organizerId: number;
}

// Инициализация
const toast = useToast();
const events = ref<Event[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const loading = ref(false);

// Форматирование даты и времени
const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month} в ${hours}:${minutes}`;
};

// Получение мероприятий
const fetchEvents = async (page: number) => {
  loading.value = true;
  try {
    const response = await axiosInstance.get('/admin/events', {
      params: { page, limit: limit.value }
    });

    if (response.data.success) {
      events.value = response.data.data?.events || [];
      currentPage.value = response.data.data?.page || 1;
      totalPages.value = response.data.data?.pages || 1;
    } else {
      toast.error(response.data.message || 'Ошибка при загрузке мероприятий');
    }
  } catch (error) {
    toast.error('Ошибка сервера');
    console.error('Ошибка при получении мероприятий:', error);
  } finally {
    loading.value = false;
  }
};

// Отмена мероприятия
const cancelEvent = async (eventId: number) => {
  if (!confirm('Вы уверены, что хотите отменить это мероприятие?')) return;

  loading.value = true;
  try {
    const response = await axiosInstance.post(`/admin/events/${eventId}`);

    if (response.data.success) {
      const event = events.value.find((e) => e.id === eventId);
      if (event) event.eventStatus = 'BANNED';
      toast.success('Мероприятие отменено');
    } else {
      toast.error(response.data.message || 'Ошибка при отмене мероприятия');
    }
  } catch (error) {
    toast.error('Ошибка сервера');
    console.error('Ошибка при отмене мероприятия:', error);
  } finally {
    loading.value = false;
  }
};

// Смена страницы
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchEvents(page);
  }
};

// Загрузка мероприятий при монтировании
fetchEvents(currentPage.value);
</script>

<style scoped>
.admin-events {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 12px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.events-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 12px;
}

.events-table tr:hover {
  background: #f3f4f6;
}

.status-badge {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.blocked {
  background: #fee2e2;
  color: #991b1b;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-button.cancel {
  background: #dc3545;
  color: #fff;
}

.action-button.cancel:hover {
  background: #b91c1c;
}

.text-gray {
  color: #6b7280;
  font-size: 13px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 0 12px;
}

.pagination-button {
  padding: 8px 16px;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: #d1d5db;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #374151;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 767px) {
  .admin-events {
    padding: 12px;
  }

  .events-table th,
  .events-table td {
    padding: 8px;
    font-size: 12px;
  }

  .events-table th {
    font-size: 10px;
  }

  .action-button,
  .text-gray {
    font-size: 12px;
    padding: 4px 8px;
  }

  .pagination {
    flex-direction: column;
    gap: 8px;
  }

  .pagination-button {
    width: 100%;
    padding: 10px;
  }

  .pagination-info {
    font-size: 12px;
  }

  /* Скрываем столбцы "Организатор" и "ID" на мобильных */
  .events-table th:nth-child(1),
  .events-table td:nth-child(1),
  .events-table th:nth-child(4),
  .events-table td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 480px) {
  .events-table th,
  .events-table td {
    font-size: 10px;
  }

  .action-button,
  .text-gray {
    font-size: 10px;
    padding: 3px 6px;
  }

  .status-badge {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>
