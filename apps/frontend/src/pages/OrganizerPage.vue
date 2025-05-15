<template>
  <div class="organizer-page">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="organizer-container">
      <!-- Информация об организаторе -->
      <div class="organizer-info">
        <div class="organizer-header">
          <h1>{{ user.firstName }} {{ user.secondName }}</h1>
          <div class="organizer-rating">
            <span class="rating-value">{{ user.rating }}</span>
            <div class="stars">
              <span v-for="i in 5" :key="i" :class="{ filled: i <= Math.round(user.rating) }"
                >★</span
              >
            </div>
          </div>
        </div>
        <p class="organizer-email">{{ user.email }}</p>
        <p v-if="user.bio" class="organizer-bio">{{ user.bio }}</p>
      </div>

      <!-- Список мероприятий -->
      <div class="events-section">
        <h2>Организованные мероприятия</h2>
        <div v-if="organizedEvents.length === 0" class="no-events">
          Пока нет организованных мероприятий
        </div>
        <div v-else class="events-grid">
          <EventCard
            v-for="event in organizedEvents"
            :key="event.id"
            :event="event"
            class="event-card"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/shared/stores/userStore';
import { useEventStore } from '@/shared/stores/eventStore';
import EventCard from '@/entities/Event/EventCard.vue';

const route = useRoute();
const userStore = useUserStore();
const eventStore = useEventStore();

const loading = ref(true);
const error = ref<string | null>(null);
const user = ref({
  firstName: '',
  secondName: '',
  email: ''
  //rating: 0,
  //bio: ''
});
const organizedEvents = ref([]);

const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Получаем ID из маршрута или используем текущего пользователя
    const userId = route.params.id ? route.params.id : undefined;
    if (!userId) return;

    // Загружаем данные пользователя
    user.value = await userStore.fetchUser(userId);

    organizedEvents.value = await eventStore.fetchOrganizedEvents(userId + '');
  } catch (err) {
    error.value = err.message || 'Произошла ошибка при загрузке данных';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
.organizer-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #ff4d4f;
}

.organizer-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.organizer-info {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.organizer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.organizer-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.organizer-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1890ff;
}

.stars {
  font-size: 1.5rem;
  color: #ddd;
}

.stars .filled {
  color: #ffc107;
}

.organizer-email {
  margin: 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.organizer-bio {
  margin-top: 1rem;
  color: #444;
  line-height: 1.5;
}

.events-section {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.events-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

.no-events {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.event-card {
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .organizer-page {
    padding: 1rem;
  }

  .organizer-info,
  .events-section {
    padding: 1.5rem;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
