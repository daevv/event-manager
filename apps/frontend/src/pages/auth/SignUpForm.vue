<template>
  <section class="auth-section">
    <div class="auth-container">
      <form class="auth-form" @submit.prevent="handleSubmit">
        <h2 class="auth-form__title">Зарегистрироваться ✌️</h2>

        <div class="name-wrapper">
          <div class="input-wrapper">
            <FormInput
              v-model="formData.secondName"
              class="auth-form__input"
              label="Фамилия"
              placeholder="Иванов"
              type="text"
            />
            <p v-if="errors.secondName" class="error-message">{{ errors.secondName }}</p>
          </div>

          <div class="input-wrapper">
            <FormInput
              v-model="formData.firstName"
              class="auth-form__input"
              label="Имя"
              placeholder="Иван"
              type="text"
            />
            <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
          </div>
        </div>

        <div class="input-wrapper">
          <FormInput
            v-model="formData.email"
            class="auth-form__input"
            label="Email"
            placeholder="Email@example.com"
            type="email"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>

        <div class="input-wrapper">
          <FormInput
            v-model="formData.password"
            :showInputToggle="true"
            class="auth-form__input"
            label="Пароль"
            placeholder="Минимум 8 символов"
            type="password"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <div class="input-wrapper">
          <FormInput
            v-model="formData.passwordConfirm"
            :showInputToggle="true"
            class="auth-form__input"
            label="Подтверждение пароля"
            placeholder="Повторите пароль"
            type="password"
          />
          <p v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</p>
        </div>

        <FormButton full-width>Зарегистрироваться</FormButton>
      </form>

      <footer class="auth-footer">
        <p>Уже есть аккаунт?</p>
        <FormButton full-width variant="secondary" @click="emit('on-sign-in')">Войти</FormButton>
      </footer>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FormInput from '@/shared/components/form/FormInput.vue';
import FormButton from '@/shared/components/form/FormButton.vue';
import axios from 'axios';
import axiosInstance from '@/shared/utilities/axiosInstance';

const emit = defineEmits<{
  (evt: 'on-sign-in', withConfirmEmailModal?: boolean): void;
}>();

const formData = ref({
  secondName: '',
  firstName: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const errors = ref({
  secondName: '',
  firstName: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

// Валидация email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация пароля: минимум 8 символов, цифра и заглавная буква
const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Валидация кириллицы для имени и фамилии
const validateCyrillic = (text: string): boolean => {
  const cyrillicRegex = /^[А-Яа-яЁё\s-]{2,}$/;
  return cyrillicRegex.test(text);
};

const handleSubmit = async () => {
  // Сброс ошибок
  errors.value = {
    secondName: '',
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  let isValid = true;

  // Валидация фамилии
  if (!formData.value.secondName) {
    errors.value.secondName = 'Фамилия обязательна';
    isValid = false;
  } else if (!validateCyrillic(formData.value.secondName)) {
    errors.value.secondName = 'Фамилия должна содержать только кириллицу и быть минимум 2 символа';
    isValid = false;
  }

  // Валидация имени
  if (!formData.value.firstName) {
    errors.value.firstName = 'Имя обязательно';
    isValid = false;
  } else if (!validateCyrillic(formData.value.firstName)) {
    errors.value.firstName = 'Имя должно содержать только кириллицу и быть минимум 2 символа';
    isValid = false;
  }

  // Валидация email
  if (!formData.value.email) {
    errors.value.email = 'Email обязателен';
    isValid = false;
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = 'Введите корректный email';
    isValid = false;
  }

  // Валидация пароля
  if (!formData.value.password) {
    errors.value.password = 'Пароль обязателен';
    isValid = false;
  } else if (!validatePassword(formData.value.password)) {
    errors.value.password =
      'Пароль должен быть минимум 8 символов, содержать цифру и заглавную букву';
    isValid = false;
  }

  // Валидация подтверждения пароля
  if (!formData.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Подтверждение пароля обязательно';
    isValid = false;
  } else if (formData.value.password !== formData.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Пароли не совпадают';
    isValid = false;
  }

  if (isValid) {
    try {
      // Объединяем имя и фамилию в одно поле name
      const payload = {
        email: formData.value.email,
        password: formData.value.password,
        firstName: formData.value.firstName,
        secondName: formData.value.secondName
      };

      // Отправка запроса на сервер
      const response = await axiosInstance.post('auth/register', payload);

      // Успешная регистрация
      console.log('Регистрация успешна:', response.data.message);
      emit('on-sign-in', true);
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Произошла ошибка при регистрации';

      // Вывод ошибки от сервера или сети
      errors.value.email = errorMessage;
    }
  }
};
</script>

<style scoped>
/* Стили остаются без изменений */
.auth-section {
  display: flex;
  justify-content: center;
  width: 50%;
}

.auth-container {
  max-width: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-direction: column;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.auth-form__title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.auth-form__subtitle {
  font-size: 16px;
  color: #666;
}

.auth-form__input {
  width: 100%;
}
.name-wrapper {
  display: flex;
  gap: 1rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-message {
  color: #e63946;
  font-size: 14px;
  margin-top: 4px;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-footer p {
  font-size: 14px;
  color: #666;
}
</style>
