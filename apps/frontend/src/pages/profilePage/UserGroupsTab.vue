<template>
  <div class="groups-settings">
    <h2 class="section-title">Настройки групп пользователей</h2>

    <!-- Список групп -->
    <div v-for="group in groupStore.groups" :key="group.id" class="group">
      <div class="group-header">
        <input
          v-model="group.name"
          class="group-name-input"
          disabled
          placeholder="Название группы"
          type="text"
        />
        <div class="group-actions">
          <button class="action-button" @click="openAddUserToGroup(group.id)">
            Добавить пользователя
          </button>
          <button class="action-button delete" @click="deleteGroup(group.id)">
            Удалить группу
          </button>
        </div>
      </div>
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
          <tr v-for="member in group.members" :key="member.id">
            <td>{{ member.firstName }}</td>
            <td>{{ member.lastName }}</td>
            <td>{{ member.email }}</td>
            <td>
              <button class="remove-button" @click="removeMember(group.id, member.id)">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Кнопка создания новой группы -->
    <button class="create-group-button" @click="createGroup">Создать новую группу</button>

    <!-- Черный список -->
    <h3 class="sub-section-title">Черный список</h3>
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
        <tr v-for="user in blacklistStore.blacklist" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button class="remove-button" @click="removeFromBlacklist(user.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="add-blacklist-button" @click="openBlacklistModal">
      Добавить в черный список
    </button>

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
  gap: 20px;
}

.group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.group-name-input {
  font-size: 18px;
  font-weight: 600;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  outline: none;
  background: #f3f3f3;
}

.group-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 16px;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.action-button.delete {
  background: #ff6f61;
}

.group-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.group-table th,
.group-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.group-table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.remove-button {
  padding: 6px 12px;
  background: #ff6f61;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.create-group-button,
.add-blacklist-button {
  padding: 12px 24px;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.create-group-button:hover,
.add-blacklist-button:hover,
.action-button:hover,
.remove-button:hover {
  opacity: 0.9;
}
</style>
