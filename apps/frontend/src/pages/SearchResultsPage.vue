<template>
  <main class="main">
    <HeroSearch @update:search="applySearch" />

    <div class="content-container">
      <FiltersSidebar @update:filters="applyFilters" />

      <div class="events-container">
        <SortSelector :value="sortBy" @update:value="setSortBy" />

        <div class="events-grid">
          <EventCard v-for="event in sortedEvents" :key="event.id" :event="event" />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchResultsPage'
});
</script>

<script lang="ts" setup>
import HeroSearch from '@/widgets/HeroSearch.vue';
import FiltersSidebar from '@/widgets/FiltersSidebar.vue';
import EventCard from '@/entities/EventCard.vue';
import SortSelector from '@/components/SortSelector.vue';
import { computed, onMounted } from 'vue';
import { type Filters, useEventStore } from '@/shared/stores/eventStore';
import type { EventType } from '@/shared/models/eventsModel';
import { useUserStore } from '@/shared/stores/userStore';

const eventStore = useEventStore();
const userStore = useUserStore();

// Свойства из стора
const sortedEvents = computed<EventType[]>(() => eventStore.sortedEvents);
const sortBy = computed(() => eventStore.sortBy);

// Действия
const applySearch = (query: string) => {
  eventStore.setFilters({ searchQuery: query });
};

const applyFilters = (newFilters: Partial<Filters>) => {
  eventStore.setFilters(newFilters);
};

const setSortBy = (value: 'relevance' | 'date' | 'price') => {
  eventStore.setSortBy(value);
};

// Загрузка данных при монтировании
onMounted(() => {
  eventStore.fetchEvents();
  userStore.fetchUser();
});
</script>

<style scoped>
/* Основной контейнер */
.main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
}

/* Контейнер контента */
.content-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
  max-width: 1720px;
}

/* Контейнер для событий */
.events-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Сетка событий */
.events-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 48px;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 767px) {
  .content-container {
    margin-top: 40px;
    max-width: 100%;
  }

  .events-container {
    max-width: 100%;
  }

  .events-grid {
    margin-top: 40px;
    max-width: 100%;
  }
}
</style>
