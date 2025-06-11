<!-- src/pages/admin/AdminUsers.vue -->
<template>
  <div class="admin-users">
    <!-- Таблица пользователей -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Email</th>
            <th>Мероприятия</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.secondName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.organizedEvents?.map((e) => e.id).join(', ') || 'Нет' }}</td>
            <td>
              <span :class="['status-badge', user.isBlocked ? 'blocked' : 'active']">
                {{ user.isBlocked ? 'Заблокирован' : 'Активен' }}
              </span>
            </td>
            <td>
              <button
                v-if="!user.isBlocked"
                @click="blockUser(user.id)"
                class="action-button block"
              >
                Заблокировать
              </button>
              <button v-else @click="" class="action-button unblock">
                Разблокировать
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
import { ref } from 'vue';
import axios from 'axios';
import axiosInstance from '@/shared/utilities/axiosInstance';
import { useToast } from 'vue-toastification';

// Типы для данных с бэкенда
interface User {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  isBlocked: boolean;
  organizedEvents?: { id: number }[];
}

// Состояние
const users = ref<User[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const loading = ref(false);
const toast = useToast();

// Получение пользователей
const fetchUsers = async (page: number) => {
  loading.value = true;
  try {
    const response = await axiosInstance.get('/admin/users', {
      params: { page, limit: limit.value }
    });

    if (response.data.success) {
      users.value = response.data.data?.users || [];
      currentPage.value = response.data.data?.page || 1;
      totalPages.value = response.data.data?.pages || 1;
    } else {
      toast.error(response.data.message || 'Ошибка при загрузке пользователей');
    }
  } catch (error) {
    toast.error('Ошибка сервера ' + String(error));
    console.error('Ошибка при получении пользователей');
  } finally {
    loading.value = false;
  }
};

// Блокировка пользователя
const blockUser = async (userId: number) => {
  loading.value = true;
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/block`);

    if (response.data.success) {
      const user = users.value.find((u) => u.id === userId);
      if (user) user.isBlocked = true;
      toast.success('Пользователь заблокирован');
    } else {
      toast.error(response.data.message || 'Ошибка при блокировке');
    }
  } catch (error) {
    toast.error('Ошибка сервера');
    console.error('Ошибка при блокировке:', error);
  } finally {
    loading.value = false;
  }
};

// Разблокировка пользователя (заглушка, так как метода нет в бэкенде)
// const unblockUser = async (userId: number) => {
//   loading.value = true;
//   try {
//     // Предполагаемый endpoint для разблокировки
//     const response = await axios.post(`/api/admin/users/${userId}/unblock`, {}, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });

//     if (response.data.success) {
//       const user = users.value.find(u => u.id === userId);
//       if (user) user.isBlocked = false;
//       toast.success('Пользователь разблокирован')
//     } else {
//       toast.error(response.data.message || 'Ошибка при разблокировке')
//     }
//   } catch (error) {
//     toast.error('Ошибка сервера');
//     console.error('Ошибка при разблокировке:', error);
//   } finally {
//     loading.value = false;
//   }
// };

// Смена страницы
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUsers(page);
  }
};

// Загрузка пользователей при монтировании
fetchUsers(currentPage.value);
</script>

<style scoped>
.admin-users {
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.users-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 12px;
}

.users-table tr:hover {
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

.action-button.block {
  background: #dc3545;
  color: #fff;
}

.action-button.block:hover {
  background: #b91c1c;
}

.action-button.unblock {
  background: #2563eb;
  color: #fff;
}

.action-button.unblock:hover {
  background: #1d4ed8;
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
  .admin-users {
    padding: 12px;
  }

  .users-table th,
  .users-table td {
    padding: 8px;
    font-size: 12px;
  }

  .users-table th {
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

  /* Скрываем некоторые столбцы на маленьких экранах */
  .users-table th:nth-child(3),
  .users-table td:nth-child(3), /* Фамилия */
  .users-table th:nth-child(5),
  .users-table td:nth-child(5) {
    /* Мероприятия */
    display: none;
  }
}

@media (max-width: 480px) {
  .users-table th,
  .users-table td {
    font-size: 10px;
  }

  .action-button {
    font-size: 10px;
    padding: 3px 6px;
  }

  .status-badge {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>
