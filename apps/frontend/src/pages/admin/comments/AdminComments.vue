<!-- src/pages/admin/AdminComments.vue -->
<template>
  <div class="admin-comments">
    <!-- Фильтр по мероприятию -->
    <div class="filter-container">
      <label for="eventId" class="filter-label">Фильтр по ID мероприятия:</label>
      <input
        id="eventId"
        v-model="eventIdFilter"
        type="number"
        min="1"
        class="filter-input"
        placeholder="Введите ID мероприятия"
        @input="fetchComments(1)"
      />
    </div>

    <!-- Таблица комментариев -->
    <div class="table-container">
      <table class="comments-table">
        <thead>
          <tr>
            <th>Текст</th>
            <th>Автор</th>
            <th>Мероприятие</th>
            <th>Рейтинг</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in comments" :key="comment.id">
            <td>{{ comment.text }}</td>
            <td>{{ comment.user?.firstName || comment.userId }}</td>
            <td>{{ comment.event?.title || comment.eventId }}</td>
            <td>{{ comment.rating || '–' }}</td>
            <td>
              <button @click="deleteComment(comment.id)" class="action-button delete">
                Удалить
              </button>
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
import axiosInstance from '@/shared/utilities/axiosInstance';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

// Типы для данных с бэкенда
interface Comment {
  id: number;
  text: string;
  userId: number;
  eventId: number;
  rating?: number;
  user?: { firstName: string };
  event?: { title: string };
}

// Инициализация
const toast = useToast();
const comments = ref<Comment[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const loading = ref(false);
const eventIdFilter = ref<number | null>(null);

// Получение комментариев
const fetchComments = async (page: number) => {
  loading.value = true;
  try {
    const params: { page: number; limit: number; eventId?: number } = {
      page,
      limit: limit.value
    };
    if (eventIdFilter.value) params.eventId = eventIdFilter.value;

    const response = await axiosInstance.get('/admin/comments', {
      params
    });

    if (response.data.success) {
      comments.value = response.data.data?.comments || [];
      currentPage.value = response.data.data?.page || 1;
      totalPages.value = response.data.data?.pages || 1;
    } else {
      toast.error(response.data.message || 'Ошибка при загрузке комментариев');
    }
  } catch (error) {
    toast.error('Ошибка сервера');
    console.error('Ошибка при получении комментариев:', error);
  } finally {
    loading.value = false;
  }
};

// Удаление комментария
const deleteComment = async (commentId: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;

  loading.value = true;
  try {
    const response = await axiosInstance.delete(`/admin/comments/${commentId}`);

    if (response.data.success) {
      comments.value = comments.value.filter((c) => c.id !== commentId);
      toast.success('Комментарий удален');
    } else {
      toast.error(response.data.message || 'Ошибка при удалении комментария');
    }
  } catch (error) {
    toast.error('Ошибка сервера');
    console.error('Ошибка при удалении комментария:', error);
  } finally {
    loading.value = false;
  }
};

// Смена страницы
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchComments(page);
  }
};

// Загрузка комментариев при монтировании
fetchComments(currentPage.value);
</script>

<style scoped>
.admin-comments {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.filter-input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: 200px;
  outline: none;
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  border-color: #2563eb;
}

.table-container {
  overflow-x: auto;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
}

.comments-table th,
.comments-table td {
  padding: 12px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.comments-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 12px;
}

.comments-table tr:hover {
  background: #f3f4f6;
}

.action-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-button.delete {
  background: #dc3545;
  color: #fff;
}

.action-button.delete:hover {
  background: #b91c1c;
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
  .admin-comments {
    padding: 12px;
  }

  .filter-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .filter-input {
    width: 100%;
  }

  .comments-table th,
  .comments-table td {
    padding: 8px;
    font-size: 12px;
  }

  .comments-table th {
    font-size: 10px;
  }

  .action-button {
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

  /* Скрываем столбцы "Автор" и "Рейтинг" на мобильных */
  .comments-table th:nth-child(2),
  .comments-table td:nth-child(2),
  .comments-table th:nth-child(4),
  .comments-table td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 480px) {
  .comments-table th,
  .comments-table td {
    font-size: 10px;
  }

  .action-button {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>
