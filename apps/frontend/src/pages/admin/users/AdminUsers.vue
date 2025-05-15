<!-- src/pages/admin/AdminUsers.vue -->
<template>
  <div class="admin-users">
    <h2 class="section-title">Список пользователей</h2>
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Почта</th>
          <th>Управляемые мероприятия</th>
          <th>Созданные мероприятия</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ getManagedEvents(user.id).join(', ') || 'Нет' }}</td>
          <td>{{ getCreatedEvents(user.id).join(', ') || 'Нет' }}</td>
          <td>
            <button v-if="!user.isBlocked" class="action-button block" @click="blockUser(user.id)">
              Заблокировать
            </button>
            <button v-else class="action-button unblock" @click="unblockUser(user.id)">
              Разблокировать
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { USERS } from '@/shared/models/usersModel';
import { EVENTS } from '@/shared/models/eventsMock';
import { LOGS } from '@/shared/models/logsModel';

const users = ref(USERS);

const getManagedEvents = (userId: number) => {
  return EVENTS.filter((event) => event.adminIds.includes(userId)).map((event) => event.id);
};

const getCreatedEvents = (userId: number) => {
  return EVENTS.filter((event) => event.organiserId === userId).map((event) => event.id);
};

const blockUser = (userId: number) => {
  const user = users.value.find((u) => u.id === userId);
  if (user) {
    user.isBlocked = true;
    x;
    logAction('Блокировка пользователя', userId, null);
  }
};

const unblockUser = (userId: number) => {
  const user = users.value.find((u) => u.id === userId);
  if (user) {
    user.isBlocked = false;
    logAction('Разблокировка пользователя', userId, null);
  }
};

// Функция для логирования действий
const logAction = (action: string, userId: number | null, eventId: number | null) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  LOGS.push({
    id: LOGS.length + 1,
    action,
    userId,
    eventId,
    timestamp
  });
};
</script>

<style scoped>
.admin-users {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.users-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-button.block {
  background: #ff6f61;
  color: #fff;
}

.action-button.block:hover {
  background: #e65a50;
}

.action-button.unblock {
  background: #2196f3;
  color: #fff;
}

.action-button.unblock:hover {
  background: #1976d2;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 20px;
  }

  .users-table th,
  .users-table td {
    padding: 8px;
    font-size: 14px;
  }

  .action-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
