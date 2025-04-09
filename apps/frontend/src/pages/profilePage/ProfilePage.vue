<!-- src/pages/ProfilePage.vue -->
<template>
  <main class="profile-page">
    <EventHeader />
    <h1 class="page-title">Профиль пользователя</h1>

    <!-- Вкладки -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Содержимое вкладок -->
    <div class="tab-content">
      <!-- Вкладка 1: Общие настройки -->
      <ProfileTab v-if="activeTab === 'general'" />

      <!-- Вкладка 2: Настройки групп пользователей -->
      <UserGroupsTab v-if="activeTab === 'groups'" />

      <!-- Вкладка 3: Настройки мероприятий -->
      <EventSettingsTab v-if="activeTab === 'events'" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EventHeader from '@/widgets/EventHeader.vue';
import UserGroupsTab from '@/pages/profilePage/UserGroupsTab.vue';
import EventSettingsTab from '@/pages/profilePage/EventSettingsTab.vue';
import ProfileTab from '@/pages/profilePage/ProfileTab.vue';

// Вкладки
const tabs = [
  { id: 'general', name: 'Общие настройки' },
  { id: 'groups', name: 'Настройки групп' },
  { id: 'events', name: 'Настройки мероприятий' }
];
const activeTab = ref<'general' | 'groups' | 'events'>('general');
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease, border-bottom 0.3s ease;
}

.tab-button.active {
  color: #ff6f61;
  border-bottom: 2px solid #ff6f61;
}

.tab-button:hover {
  color: #ff6f61;
}

.tab-content {
  padding: 20px;
}

.sub-section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 20px 0;
}

/* Вкладка 1: Общие настройки */

@media (max-width: 767px) {
  .profile-page {
    margin: 20px auto;
    padding: 0 10px;
  }

  .page-title {
    font-size: 24px;
  }

  .tab-button {
    padding: 10px 16px;
    font-size: 14px;
  }

  .section-title {
    font-size: 20px;
  }

  .sub-section-title {
    font-size: 18px;
  }

  .form-input,
  .form-textarea {
    font-size: 14px;
  }

  .save-button,
  .create-group-button,
  .add-blacklist-button {
    font-size: 14px;
    padding: 10px 20px;
  }

  .group-name-input {
    font-size: 16px;
  }

  .group-table th,
  .group-table td {
    padding: 8px;
    font-size: 14px;
  }

  .action-button,
  .remove-button,
  .edit-event-button {
    font-size: 12px;
    padding: 6px 12px;
  }

  .event-title {
    font-size: 16px;
  }

  .event-date {
    font-size: 12px;
  }
}
</style>
