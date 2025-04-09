<template>
  <main class="main">
    <EventHeader />
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

    <FooterSection />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchResultsPage'
});
</script>

<script lang="ts" setup>
import EventHeader from '@/widgets/EventHeader.vue';
import HeroSearch from '@/widgets/HeroSearch.vue';
import FiltersSidebar from '@/widgets/FiltersSidebar.vue';
import EventCard from '@/entities/EventCard.vue';
import FooterSection from '@/widgets/FooterSection.vue';
import SortSelector from '@/components/SortSelector.vue';
import { computed, onMounted } from 'vue';
import { type Filters, useEventStore } from '@/stores/eventStore';
import type { EventType } from '@/shared/models/eventsModel';

const eventStore = useEventStore();

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
  margin: 64px auto 0;
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
