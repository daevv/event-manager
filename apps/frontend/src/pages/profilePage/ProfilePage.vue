<!-- src/pages/ProfilePage.vue -->
<template>
  <main class="profile-page">
    <div class="title-container">
      <h1 class="page-title">Профиль пользователя</h1>
      <router-link
        v-if="true"
        :to="{ name: RouteNames.ADMIN }"
        class="admin-button"
      >
        Админ панель
      </router-link>
    </div>
    

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
      <ProfileTab v-if="activeTab === 'general'" />
      <UserGroupsTab v-if="activeTab === 'groups'" />
      <EventSettingsTab v-if="activeTab === 'events'" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import UserGroupsTab from '@/pages/profilePage/UserGroupsTab.vue';
import EventSettingsTab from '@/pages/profilePage/EventSettingsTab.vue';
import ProfileTab from '@/pages/profilePage/ProfileTab.vue';
import { RouteNames } from '@/shared/router';
import { useUserStore } from '@/shared/stores/userStore';

type Tabs = 'general' | 'groups' | 'events';
interface ProfileTabInterface {
  id: Tabs;
  name: string;
}

const tabs: ProfileTabInterface[] = [
  { id: 'general', name: 'Общие настройки' },
  { id: 'groups', name: 'Настройки групп' },
  { id: 'events', name: 'Настройки мероприятий' }
];
const activeTab = ref<Tabs>('general');
const userStore = useUserStore();

const isAdmin = computed<boolean>(() => userStore.isAdmin)

</script>

<style scoped>
.profile-page {
  max-width: 1280px;
  margin: 2.5rem auto;
  padding: 2rem;
  background: linear-gradient(90deg, #7d998b 0%, rgba(52, 77, 81, 0.33) 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.title-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  text-align: left;
  letter-spacing: -0.025em;
}

.admin-button {
  max-width: 150px;
  padding: 6px;
  background: #ff6f61; /* Яркий оранжевый для выделения */
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 6px;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.admin-button:hover {
  background: #e65a50;
  transform: scale(1.05); /* Лёгкое увеличение при наведении */
}

.admin-button:active {
  transform: scale(0.95); /* Эффект нажатия */
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.tab-button.active {
  color: #3b82f6;
  background: #eff6ff;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
}

.tab-content {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease-in-out;
}

.sub-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 1.5rem 0;
  letter-spacing: -0.025em;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 767px) {
  .profile-page {
    margin: 1rem;
    padding: 1rem;
    border-radius: 12px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .tabs {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tab-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }

  .tab-content {
    padding: 1rem;
  }

  .sub-section-title {
    font-size: 1.125rem;
  }

  .form-input,
  .form-textarea {
    font-size: 0.875rem;
  }

  .save-button,
  .create-group-button,
  .add-blacklist-button {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }

  .group-name-input {
    font-size: 0.875rem;
  }

  .group-table th,
  .group-table td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .action-button,
  .remove-button,
  .edit-event-button {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .event-title {
    font-size: 1rem;
  }

  .event-date {
    font-size: 0.75rem;
  }
}
</style>
