<!-- src/widgets/EventHeader.vue -->
<template>
  <header class="header">
    <div class="header-container">
      <!-- Название сайта с переходом на главную -->
      <router-link :to="{ name: RouteNames.HOME }" class="site-title"> DaevPulse </router-link>

      <!-- Навигация -->
      <nav class="nav">
        <router-link :to="{ name: RouteNames.HOME }" class="nav-link">Главная</router-link>
        <router-link :to="{ name: RouteNames.MY_EVENTS }" class="nav-link"
          >Календарь событий</router-link
        >
        <router-link :to="{ name: RouteNames.FAVOURITES }" class="nav-link">Избранное</router-link>
        <router-link :to="{ name: RouteNames.PROFILE }" class="nav-link">Профиль</router-link>
      </nav>

      <router-link :to="{ name: RouteNames.EVENT_CREATE }" class="create-event-button">
        Создать событие
      </router-link>
      <router-link :to="{ name: RouteNames.AUTH }" class="nav-link"
        ><img alt="profile img" class="profile-link" src="../assets/images/user-profile.svg"
      /></router-link>
      <router-link :to="{ name: RouteNames.NOTIFICATIONS }" class="nav-link"
        ><img
          alt="profile img"
          class="notifications-link"
          src="../assets/images/notification_icon.svg"
      /></router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventHeader'
});
</script>

<script lang="ts" setup>
import { RouteNames } from '@/shared/router';
</script>

<style scoped>
.header {
  background: linear-gradient(90deg, #4a4a4a 0%, #2d2d2d 100%);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.site-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffeb3b; /* Жёлтый цвет для контраста */
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.site-title:hover {
  color: #fff;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
  .profile-link,
  .notifications-link {
    height: 40px;
    width: 40px;
    align-content: center;
  }
}

.nav-link:hover {
  color: #ffeb3b;
}

.create-event-button {
  padding: 10px 20px;
  background: #ff6f61; /* Яркий оранжевый для выделения */
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.create-event-button:hover {
  background: #e65a50;
  transform: scale(1.05); /* Лёгкое увеличение при наведении */
}

.create-event-button:active {
  transform: scale(0.95); /* Эффект нажатия */
}

.nav-link.router-link-active {
  color: #ffeb3b;
  border-bottom: 2px solid #ffeb3b;
  padding-bottom: 2px;
}

@media (max-width: 767px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
  }

  .site-title {
    font-size: 24px;
  }

  .nav {
    gap: 20px;
  }

  .nav-link {
    font-size: 16px;
  }

  .create-event-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>
