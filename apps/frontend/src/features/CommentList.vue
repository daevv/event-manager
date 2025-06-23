<template>
  <div class="comments-container">
    <div v-if="loading" class="loading-comments">
      <div class="spinner"></div>
      <span>Загрузка комментариев...</span>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button class="retry-button" @click="fetchComments">Повторить попытку</button>
    </div>

    <template v-else>
      <div class="comments-header">
        <h3>Отзывы участников</h3>
        <div v-if="comments.length > 0" class="average-rating">
          Средняя оценка: <span class="rating-value">{{ averageRating.toFixed(1) }}</span>
          <div class="stars">
            <span v-for="i in 5" :key="i" :class="{ filled: i <= Math.round(averageRating) }"
              >★</span
            >
          </div>
        </div>
      </div>

      <div v-if="comments.length === 0" class="no-comments">
        Пока нет комментариев. Будьте первым!
      </div>

      <div v-else class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-card">
          <div class="comment-header">
            <div class="user-info">
              <span class="user-avatar">{{ comment.user?.name?.charAt(0) || 'U' }}</span>
              <span class="user-name">{{ comment.user?.name || 'Аноним' }}</span>
            </div>
            <div class="comment-rating">
              <span v-for="i in 5" :key="i" :class="{ filled: i <= comment.rating }">★</span>
            </div>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-text">{{ comment.text }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useCommentStore } from '@/shared/stores/commentStore';

const props = defineProps({
  eventId: {
    type: String,
    required: true
  }
});

const commentStore = useCommentStore();
const loading = ref(false);
const error = ref<string | null>(null);

const fetchComments = async () => {
  loading.value = true;
  error.value = null;
  try {
    await commentStore.fetchCommentsByEvent(props.eventId);
  } catch (err) {
    error.value = typeof err === 'string' ? err : 'Не удалось загрузить комментарии';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchComments();
});

const comments = computed(() => commentStore.comments);
const averageRating = computed(() => {
  if (comments.value.length === 0) return 0;
  const sum = comments.value.reduce((acc, comment) => acc + comment.rating, 0);
  return sum / comments.value.length;
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
</script>

<style scoped>
.comments-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.loading-comments {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #7f8c8d;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  padding: 1rem;
  text-align: center;
  background: #fdecea;
  border-radius: 8px;
  margin: 1rem 0;
}

.retry-button {
  display: block;
  margin: 0.5rem auto 0;
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #c0392b;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.comments-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.rating-value {
  font-weight: bold;
  color: #2c3e50;
}

.stars {
  font-size: 1rem;
  color: #ddd;
}

.stars .filled {
  color: #f1c40f;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: #95a5a6;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 8px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-card {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
}

.comment-rating {
  font-size: 1rem;
  color: #f1c40f;
}

.comment-date {
  font-size: 0.8rem;
  color: #95a5a6;
}

.comment-text {
  color: #34495e;
  line-height: 1.5;
  white-space: pre-line;
}

@media (max-width: 768px) {
  .comments-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
