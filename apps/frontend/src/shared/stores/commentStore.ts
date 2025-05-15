// stores/commentStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from '@/shared/utilities/axiosInstance';

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCommentsByEvent = async (eventId: string | number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axiosInstance.get(`/comments/${eventId}`);
      comments.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка при загрузке комментариев';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const createComment = async (payload: { text: string; rating: number; eventId: string }) => {
    loading.value = true;
    error.value = null;
    try {
      // Валидация на клиенте для быстрого ответа
      if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
        throw new Error('Оценка должна быть целым числом от 1 до 5');
      }

      const response = await axiosInstance.post('/comments', payload);
      comments.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Ошибка при создании комментария';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const updateComment = async (
    commentId: number,
    payload: {
      text?: string;
      rating?: number;
    }
  ) => {
    loading.value = true;
    error.value = null;
    try {
      if (
        payload.rating !== undefined &&
        (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5)
      ) {
        throw new Error('Оценка должна быть целым числом от 1 до 5');
      }

      const response = await axiosInstance.patch(`/comments/${commentId}`, payload);
      const index = comments.value.findIndex((c) => c.id === commentId);
      if (index !== -1) {
        comments.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || 'Ошибка при обновлении комментария';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const deleteComment = async (commentId: number) => {
    loading.value = true;
    error.value = null;
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      comments.value = comments.value.filter((c) => c.id !== commentId);
    } catch (err) {
      error.value = err.response?.data?.message || 'Ошибка при удалении комментария';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    comments,
    loading,
    error,
    fetchCommentsByEvent,
    createComment,
    updateComment,
    deleteComment
  };
});

// Типы (types.ts)
export interface Comment {
  id: number;
  text: string;
  rating: number;
  user_id: number;
  event_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  // другие поля пользователя
}
