<!-- src/pages/admin/AdminEvents.vue -->
<template>
  <div class="admin-events">
    <h2 class="section-title">Список мероприятий</h2>
    <table class="events-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Место/Время</th>
          <th>ID организатора</th>
          <th>ID участников</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in events" :key="event.placeId">
          <td>{{ event.title }}</td>
          <td>{{ `${event.date.day}/${event.date.month} в ${event.time}` }}</td>
          <td>{{ event.organiserId }}</td>
          <td>{{ event.participants.join(', ') || 'Нет' }}</td>
          <td>
            <button class="action-button cancel" @click="cancelEvent(event.placeId)">
              Отменить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { EVENTS } from '@/shared/models/eventsMock';
import { LOGS } from '@/shared/models/logsModel';

const events = ref(EVENTS);

const cancelEvent = (eventId: number) => {
  if (confirm('Вы уверены, что хотите отменить это мероприятие?')) {
    const index = events.value.findIndex((e) => e.placeId === eventId);
    if (index !== -1) {
      const event = events.value[index];
      events.value.splice(index, 1);
      logAction('Отмена мероприятия', null, eventId);
    }
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
.admin-events {
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

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.events-table th {
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

.action-button.cancel {
  background: #ff6f61;
  color: #fff;
}

.action-button.cancel:hover {
  background: #e65a50;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 20px;
  }

  .events-table th,
  .events-table td {
    padding: 8px;
    font-size: 14px;
  }

  .action-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
