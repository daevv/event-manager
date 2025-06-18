<!-- src/pages/admin/AdminLogs.vue -->
<template>
  <div class="admin-logs">
    <h2 class="section-title">Логи и аудит</h2>

    <!-- Фильтры -->
    <div class="filters">
      <div class="filter-group">
        <label for="userIdFilter">ID пользователя:</label>
        <input
          id="userIdFilter"
          v-model="filters.userId"
          class="filter-input"
          placeholder="Введите ID"
          type="text"
          @input="fetchLogs"
        />
      </div>

      <div class="filter-group">
        <label for="methodFilter">Метод:</label>
        <select id="methodFilter" v-model="filters.method" class="filter-input" @change="fetchLogs">
          <option value="">Все</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="statusFilter">Статус:</label>
        <input
          id="statusFilter"
          v-model="filters.status"
          class="filter-input"
          max="599"
          min="100"
          placeholder="200, 404 и т.д."
          type="number"
          @input="fetchLogs"
        />
      </div>

      <div class="filter-group">
        <label for="dateFrom">С:</label>
        <input
          id="dateFrom"
          v-model="filters.startDate"
          class="filter-input"
          type="datetime-local"
          @change="fetchLogs"
        />
      </div>

      <div class="filter-group">
        <label for="dateTo">По:</label>
        <input
          id="dateTo"
          v-model="filters.endDate"
          class="filter-input"
          type="datetime-local"
          @change="fetchLogs"
        />
      </div>

      <button class="reset-btn" @click="resetFilters">Сбросить</button>
    </div>

    <!-- Таблица логов -->
    <div class="table-container">
      <table class="logs-table">
        <thead>
          <tr>
            <th @click="sortBy('method')">
              Метод
              <span v-if="sort.field === 'method'">{{ sort.order === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('url')">
              URL
              <span v-if="sort.field === 'url'">{{ sort.order === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('status')">
              Статус
              <span v-if="sort.field === 'status'">{{ sort.order === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('userId')">
              ID пользователя
              <span v-if="sort.field === 'userId'">{{ sort.order === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('timestamp')">
              Дата и время
              <span v-if="sort.field === 'timestamp'">{{ sort.order === 'asc' ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td :class="`method-${log.method?.toLowerCase()}`">{{ log.method }}</td>
            <td class="url-cell">{{ log.url }}</td>
            <td :class="`status-${log.status}`">{{ log.status }}</td>
            <td>{{ log.userId || '—' }}</td>
            <td>{{ formatDateTime(log.timestamp) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-if="!loading && logs.length === 0" class="no-data">Нет данных</div>
    </div>

    <!-- Пагинация -->
    <div class="pagination">
      <button :disabled="pagination.page === 1 || loading" @click="prevPage">Назад</button>

      <span>Страница {{ pagination.page }} из {{ pagination.totalPages }}</span>

      <button :disabled="pagination.page === pagination.totalPages || loading" @click="nextPage">
        Вперед
      </button>

      <select v-model="pagination.limit" class="page-size-select" @change="fetchLogs">
        <option value="10">10 на странице</option>
        <option value="25">25 на странице</option>
        <option value="50">50 на странице</option>
        <option value="100">100 на странице</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { format } from 'date-fns';
import axiosInstance from '@/shared/utilities/axiosInstance';

interface Log {
  id: number;
  method: string;
  url: string;
  status: number;
  userId?: string;
  timestamp: string;
}

const logs = ref<Log[]>([]);
const loading = ref(false);

// Фильтры
const filters = ref({
  userId: '',
  method: '',
  status: '',
  startDate: '',
  endDate: ''
});

// Сортировка
const sort = ref({
  field: 'timestamp',
  order: 'desc'
});

// Пагинация
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
});

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'dd.MM.yyyy HH:mm:ss');
};

const sortBy = (field: string) => {
  if (sort.value.field === field) {
    sort.value.order = sort.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sort.value.field = field;
    sort.value.order = 'asc';
  }
  fetchLogs();
};

const resetFilters = () => {
  filters.value = {
    userId: '',
    method: '',
    status: '',
    startDate: '',
    endDate: ''
  };
  fetchLogs();
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchLogs();
  }
};

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchLogs();
  }
};

const fetchLogs = async () => {
  try {
    loading.value = true;

    const params = {
      ...filters.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortField: sort.value.field,
      sortOrder: sort.value.order
    };

    const response = await axiosInstance.get('/admin/logs', { params });

    logs.value = response.data.data;
    pagination.value = {
      ...pagination.value,
      total: response.data.pagination.total,
      totalPages: response.data.pagination.totalPages
    };
  } catch (error) {
    console.error('Ошибка при загрузке логов:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLogs);
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
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.filter-input {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 40px;
  box-sizing: border-box;
}

.reset-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  height: 40px;
  align-self: flex-end;
}

.reset-btn:hover {
  background: #eee;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.logs-table th,
.logs-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.logs-table th {
  background: #f9f9f9;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.logs-table th:hover {
  background: #f0f0f0;
}

.logs-table tr:hover {
  background: #fafafa;
}

.method-get {
  color: #2e7d32;
  font-weight: 500;
}

.method-post {
  color: #1565c0;
  font-weight: 500;
}

.method-put {
  color: #ff8f00;
  font-weight: 500;
}

.method-delete {
  color: #c62828;
  font-weight: 500;
}

.status-200 {
  color: #2e7d32;
}

.status-400,
.status-404,
.status-500 {
  color: #c62828;
}

.url-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-size-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: auto;
}

.loading,
.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: auto;
  }

  .reset-btn {
    align-self: stretch;
  }

  .logs-table th,
  .logs-table td {
    padding: 8px;
    font-size: 13px;
  }
}
</style>
