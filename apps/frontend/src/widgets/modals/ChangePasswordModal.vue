<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h3>Сменить пароль</h3>

      <div class="form-group">
        <label>Текущий пароль:</label>
        <div class="password-wrapper">
          <input
            v-model="passwordForm.current"
            :type="showPassword.current ? 'text' : 'password'"
            class="form-input"
          />
          <button class="eye-btn" type="button" @click="togglePasswordVisibility('current')">
            {{ showPassword.current ? '🙈' : '👁️' }}
          </button>
        </div>
        <span class="error">{{ passwordErrors.current }}</span>
      </div>

      <div class="form-group">
        <label>Новый пароль:</label>
        <div class="password-wrapper">
          <input
            v-model="passwordForm.new"
            :type="showPassword.new ? 'text' : 'password'"
            class="form-input"
          />
          <button class="eye-btn" type="button" @click="togglePasswordVisibility('new')">
            {{ showPassword.new ? '🙈' : '👁️' }}
          </button>
        </div>
        <span class="error">{{ passwordErrors.new }}</span>
      </div>

      <div class="form-group">
        <label>Повторите новый пароль:</label>
        <div class="password-wrapper">
          <input
            v-model="passwordForm.repeat"
            :type="showPassword.repeat ? 'text' : 'password'"
            class="form-input"
          />
          <button class="eye-btn" type="button" @click="togglePasswordVisibility('repeat')">
            {{ showPassword.repeat ? '🙈' : '👁️' }}
          </button>
        </div>
        <span class="error">{{ passwordErrors.repeat }}</span>
      </div>

      <button :disabled="!canSubmitPassword" class="save-button" @click="submitPasswordChange">
        Подтвердить
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue';
import axiosInstance from '@/shared/utilities/axiosInstance';

const emit = defineEmits(['close']);

const passwordForm = ref({
  current: '',
  new: '',
  repeat: ''
});

const passwordErrors = ref({
  current: '',
  new: '',
  repeat: ''
});

const showPassword = ref({
  current: false,
  new: false,
  repeat: false
});

const togglePasswordVisibility = (field: 'current' | 'new' | 'repeat') => {
  showPassword.value[field] = !showPassword.value[field];
};

const validatePasswordForm = () => {
  let valid = true;
  passwordErrors.value = { current: '', new: '', repeat: '' };

  const { current, new: newPass, repeat } = passwordForm.value;

  if (!current) {
    passwordErrors.value.current = 'Обязательное поле';
    valid = false;
  }

  const passwordRules = [
    { test: /.{8,}/, message: 'Минимум 8 символов' },
    { test: /[A-Z]/, message: 'Хотя бы одна заглавная буква' },
    { test: /[0-9]/, message: 'Хотя бы одна цифра' }
  ];

  for (const rule of passwordRules) {
    if (!rule.test.test(newPass)) {
      passwordErrors.value.new = rule.message;
      valid = false;
      break;
    }
  }

  if (!repeat) {
    passwordErrors.value.repeat = 'Обязательное поле';
    valid = false;
  } else if (newPass !== repeat) {
    passwordErrors.value.repeat = 'Пароли не совпадают';
    valid = false;
  }

  return valid;
};

const canSubmitPassword = ref(false);

const submitPasswordChange = async () => {
  const valid = validatePasswordForm();
  canSubmitPassword.value = valid;

  if (!valid) return;

  try {
    await axiosInstance.post('/auth/changePassword', {
      currentPassword: passwordForm.value.current,
      newPassword: passwordForm.value.new,
      repeatPassword: passwordForm.value.repeat
    });

    emit('close');
  } catch (error) {
    // handle error
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.password-wrapper {
  display: flex;
  align-items: center;
}

.eye-btn {
  margin-left: 10px;
  cursor: pointer;
}

.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}
</style>
