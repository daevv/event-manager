<template>
  <div v-if="isLoading" class="loading">Загрузка...</div>
  <div v-else class="general-settings">
    <h2 class="section-title">Общие настройки</h2>
    <form class="user-form" @submit.prevent="saveUserInfo">
      <!-- Имя -->
      <div class="form-group">
        <label>Имя:</label>
        <div class="editable-field">
          <input
            v-if="editable.firstName"
            v-model="formData.firstName"
            class="form-input"
            type="text"
          />
          <span v-else>{{ formData?.firstName }}</span>
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
            v-model="formData.secondName"
            class="form-input"
            type="text"
          />
          <span v-else>{{ formData?.secondName }}</span>
          <button class="edit-btn" type="button" @click="toggleEditable('secondName')">✏️</button>
        </div>
        <span v-if="errors.secondName" class="error">{{ errors.secondName }}</span>
      </div>

      <!-- Почта -->
      <div class="form-group">
        <label>Почта:</label>
        <input :value="formData.email" class="form-input" disabled type="email" />
      </div>

      <!-- Интересы -->
      <div class="form-group">
        <label>Интересы:</label>
        <div class="editable-field">
          <span>{{ formData?.interests.join(', ') || 'Нет интересов' }}</span>
          <button class="edit-btn" type="button" @click="interestModalOpen = true">✏️</button>
        </div>
      </div>

      <button :disabled="isSaving" class="save-button" type="submit">Сохранить</button>
      <button :disabled="isSaving" class="change-pass-btn" type="button" @click="changePassword">
        Изменить пароль
      </button>
    </form>

    <!-- Модалка интересов -->
    <InterestModal
      v-if="interestModalOpen"
      :interests="formData.interests"
      @close="interestModalOpen = false"
      @update:interests="updateInterests"
    />

    <!-- Модалка смены пароля -->
    <ChangePasswordModal v-if="passwordModalOpen" @close="passwordModalOpen = false" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/shared/stores/userStore';
import { useToast } from 'vue-toastification';
import InterestModal from '@/widgets/modals/InterestModal.vue';
import ChangePasswordModal from '@/widgets/modals/ChangePasswordModal.vue';

const toast = useToast();
const userStore = useUserStore();

const isLoading = ref(true);
const isSaving = ref(false);
const formData = ref<{
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  interests: string[];
} | null>(null);
const editable = ref({ firstName: false, secondName: false });
const interestModalOpen = ref(false);
const passwordModalOpen = ref(false);
const errors = ref({ firstName: '', secondName: '' });

// Загрузка данных пользователя при монтировании
onMounted(async () => {
  try {
    if (userStore.isAuthenticated()) {
      const userData = await userStore.fetchUser();
      formData.value = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        secondName: userData.secondName,
        interests: userData.interests || []
      };
    } else {
      toast.error('Требуется авторизация');
    }
  } catch (error: any) {
    toast.error(error.message || 'Ошибка загрузки данных пользователя');
  } finally {
    isLoading.value = false;
  }
});

// Переключение режима редактирования
const toggleEditable = (field: 'firstName' | 'secondName') => {
  if (!formData.value) return;
  if (editable.value[field]) {
    validateField(field);
  }
  editable.value[field] = !editable.value[field];
};

// Валидация полей
const validateField = (field: 'firstName' | 'secondName') => {
  if (!formData.value) return;
  const value = formData.value[field];
  const validCyrillic = /^[А-Яа-яЁё]{2,}$/;
  if (!value || !validCyrillic.test(value)) {
    errors.value[field] = 'Только кириллица, минимум 2 буквы';
  } else {
    errors.value[field] = '';
  }
};

// Обновление интересов
const updateInterests = async (interests: string[]) => {
  if (!formData.value) return;
  try {
    await userStore.updateUser({ interests });
    formData.value.interests = interests;
    toast.success('Интересы обновлены');
    interestModalOpen.value = false;
  } catch (error: any) {
    toast.error(error.message || 'Ошибка обновления интересов');
  }
};

// Сохранение данных пользователя
const saveUserInfo = async () => {
  if (!formData.value) return;

  validateField('firstName');
  validateField('secondName');

  if (errors.value.firstName || errors.value.secondName) {
    toast.error('Исправьте ошибки валидации');
    return;
  }

  isSaving.value = true;
  try {
    const { firstName, secondName } = formData.value;
    await userStore.updateUser({ firstName, secondName });
    toast.success('Данные обновлены');
    editable.value.firstName = false;
    editable.value.secondName = false;
  } catch (error: any) {
    toast.error(error.message || 'Ошибка сохранения данных');
  } finally {
    isSaving.value = false;
  }
};

// Открытие модалки смены пароля
const changePassword = () => {
  passwordModalOpen.value = true;
};
</script>

<style scoped>
.loading,
.error-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

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

.save-button:hover,
.change-pass-btn:hover {
  background: #e65a50;
}

.save-button:disabled,
.change-pass-btn:disabled {
  background: #999;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 12px;
}
</style>
