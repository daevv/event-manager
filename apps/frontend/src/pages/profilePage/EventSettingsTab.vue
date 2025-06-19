<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useEventStore } from '@/shared/stores/eventStore';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import EventCard from '@/entities/Event/EventCard.vue';

const store = useEventStore();

const viewMode = ref<'organized' | 'admin'>('organized');
const currentPage = ref(1);
const perPage = 20;

const sortBy = ref<'date' | 'title'>('date');
const sortOptions = [
  { label: 'Дате', value: 'date' },
  { label: 'Названию', value: 'title' }
];
const selectedSortOption = computed({
  get: () => sortOptions.find((opt) => opt.value === sortBy.value) || sortOptions[0],
  set: (val) => (sortBy.value = val.value as 'date' | 'title')
});

// Загрузка мероприятий
onMounted(async () => {
  await store.fetchOrganizedEvents();
  await store.fetchAdministratedEvents();
});

// Получение мероприятий в зависимости от выбранного режима
const userEvents = computed(() => {
  const events = viewMode.value === 'organized' ? store.organizedEvents : store.administratedEvents;

  return [...events].sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });
});

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return userEvents.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(userEvents.value.length / perPage));

const isEventPast = (event: any) => new Date(event.dateTime) < new Date();
</script>

<template>
  <div class="events-settings">
    <h2 class="section-title">Настройки мероприятий</h2>

    <!-- Переключатель -->
    <div class="switch-wrapper">
      <label>
        <input v-model="viewMode" type="radio" value="organized" />
        Организатор
      </label>
      <label>
        <input v-model="viewMode" type="radio" value="admin" />
        Администратор
      </label>
    </div>

    <!-- Сортировка -->
    <div class="sort-dropdown">
      <label class="sort-label">Сортировать по:</label>
      <Listbox v-model="selectedSortOption">
        <div class="listbox-wrapper">
          <ListboxButton class="listbox-button">
            {{ selectedSortOption.label }}
            <span class="arrow">▼</span>
          </ListboxButton>
          <ListboxOptions class="listbox-options">
            <ListboxOption
              v-for="option in sortOptions"
              :key="option.value"
              :value="option"
              class="listbox-option"
            >
              {{ option.label }}
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>

    <!-- Список мероприятий -->
    <div class="events-list">
      <EventCard
        v-for="event in paginatedEvents"
        :key="event.id"
        :event="event"
        :isEventPast="isEventPast(event)"
        :isForAdmin="true"
      />
    </div>

    <!-- Пагинация -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="currentPage--">Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Вперёд</button>
    </div>
  </div>
</template>

<style scoped>
.events-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.events-settings:deep(.card-container) {
  flex-direction: row;
  height: 250px;
}
.events-settings:deep(.card-container .title) {
  font-size: 18px;
}
.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.switch-wrapper {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.switch-wrapper label {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.sort-label {
  font-size: 14px;
  color: #444;
}

.listbox-wrapper {
  position: relative;
  width: 160px;
}

.listbox-button {
  width: 100%;
  padding: 6px 10px;
  font-size: 14px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  font-size: 12px;
  margin-left: 8px;
}

.listbox-options {
  position: absolute;
  z-index: 10;
  width: 100%;
  margin-top: 4px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.listbox-option {
  padding: 8px 10px;
  cursor: pointer;
  font-size: 14px;
}

.listbox-option:hover {
  background-color: #f0f0f0;
}

.events-list {
  display: flex;
  gap: 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.pagination button {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
