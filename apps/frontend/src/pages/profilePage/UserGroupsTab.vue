<template>
  <div class="groups-settings">
    <h2 class="section-title">Настройки групп пользователей</h2>

    <!-- Список групп -->
    <div class="groups-container">
      <div v-for="group in groupStore.groups" :key="group.id" class="group-card">
        <div class="group-header">
          <input
            v-model="group.name"
            class="group-name-input"
            disabled
            placeholder="Название группы"
            type="text"
          />
          <div class="group-actions">
            <button class="action-button" @click.stop="openAddUserToGroup(group.id)">
              <span class="icon">➕</span> Добавить
            </button>
            <button class="action-button delete" @click.stop="deleteGroup(group.id)">
              <span class="icon">🗑️</span> Удалить
            </button>
          </div>
        </div>
        <div class="group-content">
          <table class="group-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Почта</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in group.members" :key="member.id" class="table-row">
                <td>{{ member.firstName }}</td>
                <td>{{ member.secondName }}</td>
                <td>{{ member.email }}</td>
                <td>
                  <button class="remove-button" @click="removeMember(group.id, member.id)">
                    <span class="icon">✖</span> Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Кнопка создания новой группы -->
    <button class="create-group-button" @click="createGroup">
      <span class="icon">➕</span> Создать новую группу
    </button>

    <!-- Черный список -->
    <h3 class="sub-section-title">Черный список</h3>
    <button class="add-blacklist-button" @click="openBlacklistModal">
      <span class="icon">🚫</span> Добавить в черный список
    </button>
    <div class="blacklist-container">
      <table class="group-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Почта</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in blacklistStore.blacklist" :key="user.id" class="table-row">
            <td>{{ user.firstName }}</td>
            <td>{{ user.secondName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="remove-button" @click="removeFromBlacklist(user.id)">
                <span class="icon">✖</span> Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модалки -->
    <InputModal
      v-if="isGroupModalOpen"
      :visible="isGroupModalOpen"
      message="Введите email пользователя, чтобы добавить его в выбранную группу"
      title="Добавить пользователя в группу"
      @cancel="isGroupModalOpen = false"
      @submit="onConfirmAddToGroup"
    />
    <InputModal
      v-if="isBlacklistModalOpen"
      :visible="isBlacklistModalOpen"
      message="Введите email пользователя, которого вы хотите заблокировать"
      title="Добавить пользователя в черный список"
      @cancel="isBlacklistModalOpen = false"
      @submit="onConfirmBlacklist"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useGroupStore } from '@/shared/stores/groupStore';
import { useBlacklistStore } from '@/shared/stores/blacklistStore';
import InputModal from '@/widgets/modals/InputModal.vue';

const groupStore = useGroupStore();
const blacklistStore = useBlacklistStore();

const isGroupModalOpen = ref(false);
const isBlacklistModalOpen = ref(false);
const selectedGroupId = ref<number | null>(null);

onMounted(() => {
  groupStore.fetchGroups();
  blacklistStore.fetchBlacklist();
});

const openAddUserToGroup = (groupId: number) => {
  selectedGroupId.value = groupId;
  isGroupModalOpen.value = true;
};

const onConfirmAddToGroup = async (email: string) => {
  try {
    await groupStore.addMember(selectedGroupId.value!, email);
    await groupStore.fetchGroups();
    isGroupModalOpen.value = false;
  } catch (err: any) {
    alert(err.message);
  }
};

const createGroup = async () => {
  await groupStore.createGroup(`Группа ${groupStore.groups.length + 1}`);
  await groupStore.fetchGroups();
};

const deleteGroup = async (groupId: number) => {
  if (confirm('Вы уверены, что хотите удалить эту группу?')) {
    await groupStore.deleteGroup(groupId);
    await groupStore.fetchGroups();
  }
};

const removeMember = async (groupId: number, userId: number) => {
  await groupStore.removeMember(groupId, userId);
  await groupStore.fetchGroups();
};

const openBlacklistModal = () => {
  isBlacklistModalOpen.value = true;
};

const onConfirmBlacklist = async (email: string) => {
  try {
    await blacklistStore.addToBlacklist(email);
    await blacklistStore.fetchBlacklist();
    isBlacklistModalOpen.value = false;
  } catch (err: any) {
    alert(err.message);
  }
};

const removeFromBlacklist = async (id: number) => {
  await blacklistStore.removeFromBlacklist(id);
  await blacklistStore.fetchBlacklist();
};
</script>

<style scoped>
.groups-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.3s ease-in-out;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #27272b;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.group-card[open] .group-header {
  border-bottom: 1px solid #e2e8f0;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-radius: 12px 12px 0 0;
  background: #f8fafc;
  transition: background 0.3s ease;
}

.group-header:hover {
  background: #f1f5f9;
}

.group-name-input {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1e293b;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 50%;
  outline: none;
  transition: border-color 0.3s ease;
}

.group-name-input:focus {
  border-color: #3b82f6;
}

.group-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background: #2563eb;
  transform: scale(1.05);
}

.action-button.delete {
  background: #ef4444;
}

.action-button.delete:hover {
  background: #dc2626;
}

.group-content {
  padding: 1.5rem;
}

.group-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.group-table th,
.group-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  color: #1e293b;
}

.group-table th {
  background: #f1f5f9;
  font-weight: 600;
  color: #475569;
}

.group-table td {
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  transition: background 0.2s ease;
}

.table-row:hover {
  background: #f1f5f9;
}

.remove-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #ffffff;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.remove-button:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.create-group-button,
.add-blacklist-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  background: #7d998b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  align-self: flex-start;
}

.create-group-button:hover,
.add-blacklist-button:hover {
  background: #2563eb;
  transform: scale(1.05);
}

.blacklist-container,
.group-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.sub-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4f5767;
  margin: 1.5rem 0 1rem;
  letter-spacing: -0.025em;
}

.icon {
  font-size: 1rem;
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
  .groups-settings {
    gap: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .group-card {
    padding: 0.5rem;
  }

  .group-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .group-name-input {
    width: 100%;
    font-size: 1rem;
  }

  .group-actions {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .action-button {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .group-content {
    padding: 1rem;
  }

  .group-table th,
  .group-table td {
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .remove-button {
    padding: 0.25rem 0.5rem;
    font-size: 0.675rem;
  }

  .create-group-button,
  .add-blacklist-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    position: sticky;
    bottom: 1rem;
    z-index: 10;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .blacklist-container {
    padding: 1rem;
  }

  .sub-section-title {
    font-size: 1.125rem;
  }
}
</style>
