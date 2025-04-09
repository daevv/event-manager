<!-- src/components/SortSelector.vue -->
<template>
  <div class="sort-container">
    <label class="sort-label">Сортировать по:</label>
    <select :value="value" class="sort-select" @change="emit('update:value', $event.target.value)">
      <option value="relevance">Релевантности</option>
      <option value="date">Дате</option>
      <option value="price">Цене</option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SortSelector'
});
</script>

<script lang="ts" setup>
defineProps<{
  value: 'relevance' | 'date' | 'price';
}>();

const emit = defineEmits<{
  (e: 'update:value', value: 'relevance' | 'date' | 'price'): void;
}>();
</script>

<style scoped>
.sort-container {
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: flex-end;
  max-width: 400px;
  width: 100%;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.sort-container:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.sort-label {
  flex-grow: 1;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.sort-select {
  width: 250px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #ffeb3b;
  box-shadow: 0 0 0 3px rgba(255, 235, 59, 0.2);
}

@media (max-width: 767px) {
  .sort-container {
    max-width: 100%;
    padding: 8px 12px;
  }

  .sort-label {
    font-size: 16px;
  }

  .sort-select {
    width: 200px;
    font-size: 14px;
    padding: 8px 10px;
  }
}
</style>
