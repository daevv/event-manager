<template>
  <div class="favorites-page">
    <div class="container">
      <h1 class="page-title">Избранные мероприятия</h1>

      <div v-if="loading" class="loading-spinner">
        {{ 'Loading...' }}
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="favoriteEvents.length === 0" class="empty-state">
        <img
          alt="Нет избранных"
          class="empty-image"
          src="../../assets/images/empty-favorites.svg"
        />
        <h2>У вас пока нет избранных мероприятий</h2>
        <p>Нажимайте на ♡ у интересных событий, чтобы добавить их сюда</p>
        <router-link :to="{ name: RouteNames.HOME }" class="explore-button"
          >Найти мероприятия</router-link
        >
      </div>

      <div v-else class="events-grid">
        <FavouritesEvent
          v-for="event in favoriteEvents"
          :key="event.id"
          :event="event"
          class="event-card"
          @remove="toggleFavorite(event.id)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useEventStore } from '@/shared/stores/eventStore';
import { RouteNames } from '@/shared/router';
import { useUserStore } from '@/shared/stores/userStore';
import type { EventType } from '@/shared/models/eventsModel';
import FavouritesEvent from '@/entities/Event/FavouritesEvent.vue';

const eventStore = useEventStore();
const userStore = useUserStore();

const loading = ref(false);
const error = ref<string | null>(null);

const favoriteEventsIds = computed(() => userStore.favouriteEvents);
const favoriteEvents = computed<EventType[]>(() => {
  return favoriteEventsIds.value.map(eventStore.getEventById);
});

const toggleFavorite = async (eventId: string) => {
  try {
    await userStore.toggleFavourite(eventId);
  } catch (e) {
    console.error('Ошибка при изменении избранного:', e);
  }
};
</script>

<style scoped>
.favorites-page {
  max-width: 800px;
  min-height: calc(100vh - 380px);
  padding: 2rem 1rem;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-image {
  max-width: 50px;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.empty-state p {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.explore-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.explore-button:hover {
  background-color: var(--color-primary-light);
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: var(--color-danger);
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-danger);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>
