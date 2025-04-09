<!-- src/pages/NotFoundPage.vue -->
<template>
  <section class="not-found-section">
    <div class="not-found-container">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-message">Страница не найдена</p>
      <p class="not-found-description">
        Кажется, вы забрели куда-то не туда. Давайте вернемся на главную!
      </p>
      <FormButton full-width @click="goHome">На главную</FormButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { RouteNames } from '@/router'; // Импортируем enum с именами маршрутов
import FormButton from '@/components/form/FormButton.vue'; // Предполагаем, что у вас есть такой компонент

// Используем useRouter для навигации
const router = useRouter();

// Функция для перехода на главную страницу
const goHome = (): void => {
  router.push({ name: RouteNames.HOME });
};
</script>

<style scoped>
.not-found-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5; /* Светлый фон */
}

.not-found-container {
  text-align: center;
  padding: 2rem;
  max-width: 500px;
}

.not-found-title {
  font-size: 6rem;
  font-weight: 700;
  color: #e63946; /* Красный цвет для 404 */
  margin: 0;
}

.not-found-message {
  font-size: 2rem;
  color: #333;
  margin: 1rem 0;
}

.not-found-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}
</style>
