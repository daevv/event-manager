<!-- src/widgets/FiltersSidebar.vue -->
<template>
  <aside class="filters-sidebar">
    <h3 class="filters-title">Фильтры</h3>

    <!-- Фильтр по месту -->
    <div class="filter-section">
      <label class="filter-label">Место</label>
      <div class="checkbox-group">
        <label v-for="(place, id) in PLACES_DICT" :key="id" class="checkbox-label">
          <input
            v-model="selectedPlaces"
            :value="Number(id)"
            type="checkbox"
            @change="updateFilters"
          />
          {{ place.title }}
        </label>
      </div>
    </div>

    <!-- Фильтр по стоимости -->
    <div class="filter-section">
      <label class="filter-label">Стоимость</label>
      <select v-model="selectedCost" class="filter-select" @change="updateFilters">
        <option value="all">Все</option>
        <option value="free">Бесплатные</option>
        <option value="paid">Платные</option>
      </select>
    </div>

    <!-- Фильтр по категориям -->
    <div class="filter-section">
      <label class="filter-label">Категория</label>
      <div class="checkbox-group">
        <label
          v-for="category in Object.values(CATEGORY_MODEL)"
          :key="category"
          class="checkbox-label"
        >
          <input
            v-model="selectedCategories"
            :value="category"
            type="checkbox"
            @change="updateFilters"
          />
          {{ category }}
        </label>
      </div>
    </div>

    <!-- Кнопка сброса фильтров -->
    <button class="reset-button" @click="resetFilters">Сбросить фильтры</button>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { PLACES_DICT } from '@/shared/models/placesModel';
import { CATEGORY_MODEL } from '@/shared/models/categoryModel';

// Определяем типы для фильтров
interface Filters {
  places: number[];
  cost: 'all' | 'free' | 'paid';
  categories: string[];
  dateFrom: string | null;
  dateTo: string | null;
}

// Состояние фильтров
const selectedPlaces = ref<number[]>([]);
const selectedCost = ref<'all' | 'free' | 'paid'>('all');
const selectedCategories = ref<string[]>([]);
const dateFrom = ref<string | null>(null);
const dateTo = ref<string | null>(null);

// Эмит для передачи фильтров родительскому компоненту
const emit = defineEmits<{
  (e: 'update:filters', filters: Filters): void;
}>();

// Обновление фильтров
const updateFilters = () => {
  emit('update:filters', {
    places: selectedPlaces.value,
    cost: selectedCost.value,
    categories: selectedCategories.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value
  });
};

// Сброс фильтров
const resetFilters = () => {
  selectedPlaces.value = [];
  selectedCost.value = 'all';
  selectedCategories.value = [];
  dateFrom.value = null;
  dateTo.value = null;
  updateFilters();
};
</script>

<style scoped>
.filters-sidebar {
  width: 300px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.filter-select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}

.date-range {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-label {
  font-size: 16px;
  color: #666;
  width: 30px;
}

.date-picker {
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}

.reset-button {
  width: 100%;
  padding: 10px;
  background: #ffeb3b;
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.reset-button:hover {
  background: #ffd700;
}

@media (max-width: 767px) {
  .filters-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .filters-title {
    font-size: 20px;
  }

  .filter-label {
    font-size: 16px;
  }

  .checkbox-label {
    font-size: 14px;
  }

  .filter-select,
  .date-picker {
    font-size: 14px;
  }

  .date-label {
    font-size: 14px;
  }

  .reset-button {
    font-size: 14px;
  }
}
</style>
