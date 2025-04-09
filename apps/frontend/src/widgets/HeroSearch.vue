<!-- src/widgets/HeroSearch.vue -->
<template>
  <section class="hero-search">
    <div class="hero-content">
      <h2 class="hero-title">Найдите событие, которое вас вдохновит</h2>
      <div class="search-bar">
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="Поиск событий..."
          type="text"
          @input="updateSearch"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeroSearch'
});
</script>

<script lang="ts" setup>
import { ref } from 'vue';

const searchQuery = ref<string>('');

const emit = defineEmits<{
  (e: 'update:search', query: string): void;
}>();

const updateSearch = () => {
  emit('update:search', searchQuery.value);
};
</script>

<style scoped>
.hero-search {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 60px 20px;
  background: #f7f7f7; /* Светлый нейтральный фон */
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 100%;
}

.hero-title {
  font-size: 36px;
  font-weight: 500; /* Более лёгкий вес шрифта */
  color: #333; /* Тёмный, но не чёрный цвет */
  text-align: center;
  line-height: 1.3;
  margin: 0;
}

.search-bar {
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  border-bottom: 1px solid #ccc; /* Простая линия вместо фона */
}

.search-input {
  width: 100%;
  padding: 12px 0;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: 400;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #999;
  font-weight: 400;
}

@media (max-width: 767px) {
  .hero-search {
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 28px;
  }

  .search-bar {
    margin-top: 32px;
  }

  .search-input {
    font-size: 18px;
    padding: 10px 0;
  }
}
</style>
