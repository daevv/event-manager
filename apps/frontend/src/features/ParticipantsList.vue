<template>
  <div class="participants-container">
    <h3 class="participants-title">Участники мероприятия</h3>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Загрузка участников...</span>
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
      <button class="retry-button" @click="loadParticipants">Повторить попытку</button>
    </div>

    <div v-else-if="participants.length === 0" class="empty-state">
      Пока нет зарегистрированных участников
    </div>

    <div v-else class="participants-list">
      <div v-for="participant in participants" :key="participant.id" class="participant-card">
        <div class="participant-info">
          <div class="participant-avatar">
            {{ getInitials(participant) }}
          </div>
          <div class="participant-details">
            <span class="participant-name">
              {{ participant.secondName }} {{ participant.firstName }}
            </span>
            <span class="participant-email">{{ participant.email }}</span>
          </div>
        </div>

        <button
          :disabled="unregisterLoading"
          class="unregister-button"
          @click="unregisterParticipant(participant)"
        >
          <span v-if="unregisterLoading && unregisteringId === participant.id"> Отмена... </span>
          <span v-else>Отменить регистрацию</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useEventStore } from '@/shared/stores/eventStore';
import { storeToRefs } from 'pinia';
import type { User } from '@/shared/stores/userStore';

const props = defineProps({
  eventId: {
    type: [String, Number],
    required: true
  }
});

const eventStore = useEventStore();
const { loading, error } = storeToRefs(eventStore);
const participants = ref<User[]>([]);
const unregisterLoading = ref(false);
const unregisteringId = ref<number | null>(null);

const loadParticipants = async () => {
  try {
    participants.value = await eventStore.fetchEventParticipants(props.eventId);
  } catch (err) {
    error.value = err;
  }
};

const getInitials = (user: User) => {
  return `${user.firstName?.charAt(0) || ''}${user.secondName?.charAt(0) || ''}`;
};

const unregisterParticipant = async (participant: User) => {
  if (!confirm('Вы уверены, что хотите отменить регистрацию?')) return;

  unregisterLoading.value = true;
  unregisteringId.value = participant.id;

  try {
    await eventStore.unregister(props.eventId.toString(), participant.id.toString());
    await loadParticipants();
  } catch (err) {
    console.error('Ошибка при отмене регистрации:', err);
  } finally {
    unregisterLoading.value = false;
    unregisteringId.value = null;
  }
};

onMounted(() => {
  loadParticipants();
});
</script>

<style scoped>
.participants-container {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
}

.participants-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #2c3e50;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: #7f8c8d;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  color: #e74c3c;
  background: #fdecea;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
}

.retry-button {
  display: block;
  margin: 0.75rem auto 0;
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

.empty-state {
  text-align: center;
  padding: 1.5rem;
  color: #95a5a6;
  font-style: italic;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.participant-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.participant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.participant-avatar {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.participant-details {
  display: flex;
  flex-direction: column;
}

.participant-name {
  font-weight: 500;
  color: #2c3e50;
}

.participant-email {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.unregister-button {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  white-space: nowrap;
}

.unregister-button:hover:not(:disabled) {
  background: #e74c3c;
  color: white;
}

.unregister-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  border-color: #ddd;
  color: #ddd;
}

@media (max-width: 768px) {
  .participant-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .unregister-button {
    align-self: flex-end;
  }
}
</style>
