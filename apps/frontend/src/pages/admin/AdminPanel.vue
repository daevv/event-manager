<!-- src/pages/admin/AdminPanel.vue -->
<template>
  <div v-if="isRootUser" class="admin-panel">
    <header class="admin-header">
      <h1 class="admin-title">Админ-панель</h1>
      <nav class="admin-nav">
        <router-link :to="{ name: RouteNames.ADMIN_USERS }" class="nav-link"
          >Пользователи</router-link
        >
        <router-link :to="{ name: RouteNames.ADMIN_EVENTS }" class="nav-link"
          >Мероприятия</router-link
        >
        <router-link :to="{ name: RouteNames.ADMIN_COMMENTS }" class="nav-link"
          >Комментарии</router-link
        >
        <router-link :to="{ name: RouteNames.ADMIN_LOGS }" class="nav-link">Логи</router-link>
      </nav>
    </header>

    <main class="admin-content">
      <router-view />
    </main>
  </div>
  <div v-else class="access-denied">
    <h1>Доступ запрещён</h1>
    <p>Эта страница доступна только для root-пользователя.</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { RouteNames } from '@/shared/router';

// Предполагаем, что текущий пользователь хранится в глобальном состоянии (например, Pinia или Vuex)
// Для примера используем заглушку
const currentUserId = 0; // ID текущего пользователя (0 — root)

const isRootUser = computed(() => currentUserId === 0);
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-header {
  background: linear-gradient(90deg, #4a4a4a 0%, #2d2d2d 100%);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.admin-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffeb3b;
  text-align: center;
  margin-bottom: 20px;
}

.admin-nav {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.nav-link {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffeb3b;
}

.nav-link.router-link-active {
  color: #ffeb3b;
  border-bottom: 2px solid #ffeb3b;
  padding-bottom: 2px;
}

.admin-content {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.access-denied h1 {
  font-size: 32px;
  color: #ff6f61;
}

.access-denied p {
  font-size: 18px;
  color: #666;
}

@media (max-width: 767px) {
  .admin-title {
    font-size: 24px;
  }

  .admin-nav {
    flex-direction: column;
    gap: 15px;
  }

  .nav-link {
    font-size: 16px;
  }

  .admin-content {
    margin: 20px auto;
    padding: 0 10px;
  }

  .access-denied h1 {
    font-size: 24px;
  }

  .access-denied p {
    font-size: 16px;
  }
}
</style>
