<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>

      <h2>Оцените мероприятие</h2>

      <div class="rating-stars">
        <span
          v-for="star in 5"
          :key="star"
          :class="{ active: star <= model.rating }"
          @click="model.rating = star"
        >
          ★
        </span>
      </div>

      <textarea
        v-model="model.text"
        :disabled="loading"
        class="comment-input"
        placeholder="Оставьте отзыв (необязательно)"
      ></textarea>

      <div class="modal-footer">
        <button
          :disabled="loading || model.rating === 0"
          class="submit-button"
          @click="submitRating"
        >
          <span v-if="loading">Отправка...</span>
          <span v-else>Отправить оценку</span>
        </button>

        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useCommentStore } from '@/shared/stores/commentStore';

const props = defineProps({
  eventId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'submitted']);

const commentStore = useCommentStore();
const loading = ref(false);
const error = ref<string | null>(null);

const model = reactive({
  rating: 0,
  text: ''
});

const closeModal = () => {
  if (!loading.value) {
    emit('close');
  }
};

const submitRating = async () => {
  if (model.rating === 0) return;

  loading.value = true;
  error.value = null;

  try {
    await commentStore.createComment({
      text: model.text,
      rating: model.rating,
      eventId: props.eventId
    });

    emit('submitted');
    closeModal();
  } catch (err) {
    error.value = typeof err === 'string' ? err : 'Не удалось отправить оценку';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
}

.close-button:hover {
  color: #e74c3c;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
}

.rating-stars {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  font-size: 2.5rem;
  color: #ddd;
}

.rating-stars span {
  cursor: pointer;
  transition: color 0.2s;
  margin: 0 0.25rem;
}

.rating-stars span.active {
  color: #f1c40f;
}

.comment-input {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: #3498db;
}

.comment-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-button {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  min-width: 200px;
}

.submit-button:hover:not(:disabled) {
  background: #27ae60;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  margin-top: 1rem;
  color: #e74c3c;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .modal-content {
    padding: 1.5rem;
  }

  .rating-stars {
    font-size: 2rem;
  }
}
</style>
