<!-- src/pages/admin/AdminLogs.vue -->
<template>
  <div class="admin-logs">
    <h2 class="section-title">Логи и аудит</h2>

    <!-- Фильтры -->
    <div class="filters">
      <div class="filter-group">
        <label for="userIdFilter">Фильтр по ID пользователя:</label>
        <input
          id="userIdFilter"
          v-model="userIdFilter"
          class="filter-input"
          placeholder="Введите ID"
          type="number"
        />
      </div>
      <div class="filter-group">
        <label for="eventIdFilter">Фильтр по ID мероприятия:</label>
        <input
          id="eventIdFilter"
          v-model="eventIdFilter"
          class="filter-input"
          placeholder="Введите ID"
          type="number"
        />
      </div>
    </div>

    <!-- Таблица логов -->
    <table class="logs-table">
      <thead>
        <tr>
          <th>Действие</th>
          <th>ID пользователя</th>
          <th>ID мероприятия</th>
          <th>Дата и время</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in filteredLogs" :key="log.id">
          <td>{{ log.action }}</td>
          <td>{{ log.userId ?? '—' }}</td>
          <td>{{ log.eventId ?? '—' }}</td>
          <td>{{ log.timestamp }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { LOGS } from '@/shared/models/logsModel';

const logs = ref(LOGS);
const userIdFilter = ref<number | null>(null);
const eventIdFilter = ref<number | null>(null);

const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    const matchesUserId = !userIdFilter.value || log.userId === userIdFilter.value;
    const matchesEventId = !eventIdFilter.value || log.eventId === eventIdFilter.value;
    return matchesUserId && matchesEventId;
  });
});
</script>

<style scoped>
.admin-logs {
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

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.filter-input {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
}

.filter-input:focus {
  border-color: #ff6f61;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th,
.logs-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.logs-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 20px;
  }

  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .filter-input {
    font-size: 14px;
  }

  .logs-table th,
  .logs-table td {
    padding: 8px;
    font-size: 14px;
  }
}
</style>
