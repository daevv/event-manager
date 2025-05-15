<template>
  <div class="general-settings">
    <h2 class="section-title">Общие настройки</h2>
    <form class="user-form" @submit.prevent="saveUserInfo">
      <!-- Имя -->
      <div class="form-group">
        <label>Имя:</label>
        <div class="editable-field">
          <input
            v-if="editable.firstName"
            v-model="userInfo.firstName"
            class="form-input"
            type="text"
          />
          <span v-else>{{ userInfo.firstName }}</span>
          <button class="edit-btn" type="button" @click="toggleEditable('firstName')">✏️</button>
        </div>
        <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>
      </div>

      <!-- Фамилия -->
      <div class="form-group">
        <label>Фамилия:</label>
        <div class="editable-field">
          <input
            v-if="editable.secondName"
            v-model="userInfo.secondName"
            class="form-input"
            type="text"
          />
          <span v-else>{{ userInfo.secondName }}</span>
          <button class="edit-btn" type="button" @click="toggleEditable('secondName')">✏️</button>
        </div>
        <span v-if="errors.secondName" class="error">{{ errors.secondName }}</span>
      </div>

      <!-- Почта -->
      <div class="form-group">
        <label>Почта:</label>
        <input v-model="userInfo.email" class="form-input" disabled type="email" />
      </div>

      <!-- Интересы -->
      <div class="form-group">
        <label>Интересы:</label>
        <div class="editable-field">
          <span>{{ userInfo.interests.join(', ') }}</span>
          <button class="edit-btn" type="button" @click="interestModalOpen = true">✏️</button>
        </div>
      </div>

      <button class="save-button" type="submit">Сохранить</button>
      <button class="change-pass-btn" type="button" @click="changePassword">Изменить пароль</button>
    </form>

    <!-- Модалка интересов -->
    <InterestModal
      v-if="interestModalOpen"
      :interests="userInfo.interests"
      @close="interestModalOpen = false"
      @update:interests="updateInterests"
    />

    <!-- Модалка смены пароля -->
    <ChangePasswordModal v-if="passwordModalOpen" @close="passwordModalOpen = false" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useUserStore } from '@/shared/stores/userStore';
import { useToast } from 'vue-toastification';
import InterestModal from '@/widgets/modals/InterestModal.vue';
import ChangePasswordModal from '@/widgets/modals/ChangePasswordModal.vue';

const toast = useToast();
const userStore = useUserStore();

const userInfo = computed(() => userStore.user);
const editable = ref({ firstName: false, secondName: false });
const interestModalOpen = ref(false);
const passwordModalOpen = ref(false);
const errors = ref({ firstName: '', secondName: '' });

const toggleEditable = (field: 'firstName' | 'secondName') => {
  if (editable.value[field]) {
    validateField(field);
  }
  editable.value[field] = !editable.value[field];
};

const validateField = (field: 'firstName' | 'secondName') => {
  const value = userInfo.value[field];
  const validCyrillic = /^[А-Яа-яЁё]{2,}$/;
  if (!validCyrillic.test(value)) {
    errors.value[field] = 'Только кириллица, минимум 2 буквы';
  } else {
    errors.value[field] = '';
  }
};

const updateInterests = (interests: string[]) => {
  userStore.updateUser({ interests });
};

const saveUserInfo = async () => {
  validateField('firstName');
  validateField('secondName');

  if (errors.value.firstName || errors.value.secondName) {
    toast.error('Ошибка валидации');
    return;
  }
  const { firstName, secondName } = userInfo.value;
  userStore.updateUser({ firstName, secondName });
  toast.success('Данные обновлены!');
};

const changePassword = () => {
  passwordModalOpen.value = true;
};
</script>

<style scoped>
.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editable-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.save-button,
.change-pass-btn {
  padding: 12px 24px;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.change-pass-btn {
  background: #555;
  margin-top: 10px;
}

.save-button:hover {
  background: #e65a50;
}

.save-button:disabled {
  background: #999;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 12px;
}
</style>
