<!-- src/pages/admin/AdminComments.vue -->
<template>
  <div class="admin-comments">
    <h2 class="section-title">Список комментариев</h2>
    <table class="comments-table">
      <thead>
        <tr>
          <th>Текст</th>
          <th>ID автора</th>
          <th>ID мероприятия</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in comments" :key="comment.id">
          <td>{{ comment.text }}</td>
          <td>{{ comment.authorId }}</td>
          <td>{{ comment.eventId }}</td>
          <td>
            <button class="action-button delete" @click="deleteComment(comment.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { COMMENTS } from '@/shared/models/commentsModel';
import { LOGS } from '@/shared/models/logsModel';

const comments = ref(COMMENTS);

const deleteComment = (commentId: number) => {
  if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
    const index = comments.value.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      comments.value.splice(index, 1);
      logAction('Удаление комментария', null, null);
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
.admin-comments {
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

.comments-table {
  width: 100%;
  border-collapse: collapse;
}

.comments-table th,
.comments-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.comments-table th {
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

.action-button.delete {
  background: #ff6f61;
  color: #fff;
}

.action-button.delete:hover {
  background: #e65a50;
}

@media (max-width: 767px) {
  .section-title {
    font-size: 20px;
  }

  .comments-table th,
  .comments-table td {
    padding: 8px;
    font-size: 14px;
  }

  .action-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
