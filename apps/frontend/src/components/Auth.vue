<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <div v-if="isLogin" class="form-section">
        <h2 class="form-title">Авторизация</h2>
        <input v-model="form.email" class="form-input" placeholder="Email" required type="email" />
        <input
          v-model="form.password"
          class="form-input"
          placeholder="Пароль"
          required
          type="password"
        />
        <button class="form-button" type="submit">Войти</button>
        <button class="form-button secondary" type="button" @click="toggleForm">Регистрация</button>
        <button class="form-button link" type="button" @click="forgotPassword">
          Забыли пароль?
        </button>
      </div>
      <div v-else class="form-section">
        <h2 class="form-title">Регистрация</h2>
        <input v-model="form.email" class="form-input" placeholder="Email" required type="email" />
        <input
          v-model="form.password"
          class="form-input"
          placeholder="Пароль"
          required
          type="password"
        />
        <input
          v-model="form.confirmPassword"
          class="form-input"
          placeholder="Подтвердите пароль"
          required
          type="password"
        />
        <input v-model="form.firstName" class="form-input" placeholder="Имя" required type="text" />
        <input
          v-model="form.lastName"
          class="form-input"
          placeholder="Фамилия"
          required
          type="text"
        />
        <button class="form-button" type="submit">Зарегистрироваться</button>
        <button class="form-button secondary" type="button" @click="toggleForm">Войти</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isLogin = ref(true);
const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: ''
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const nameRegex = /^[А-Яа-я]+$/;

const validateEmail = (email: string) => emailRegex.test(email);
const validatePassword = (password: string) => passwordRegex.test(password);
const validateName = (name: string) => nameRegex.test(name);

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const forgotPassword = () => {
  alert('Функция восстановления пароля');
};

const handleSubmit = () => {
  if (isLogin.value) {
    if (!validateEmail(form.value.email)) {
      alert('Некорректный email');
      return;
    }
    console.log('Авторизация:', form.value);
  } else {
    if (!validateEmail(form.value.email)) {
      alert('Некорректный email');
      return;
    }
    if (!validatePassword(form.value.password)) {
      alert('Пароль должен содержать минимум 8 символов, одну заглавную букву и одну цифру');
      return;
    }
    if (form.value.password !== form.value.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    if (!validateName(form.value.firstName) || !validateName(form.value.lastName)) {
      alert('Имя и фамилия должны содержать только кириллицу');
      return;
    }
    console.log('Регистрация:', form.value);
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #007bff;
}

.form-button {
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-button:hover {
  background-color: #0056b3;
}

.form-button.secondary {
  background-color: #6c757d;
}

.form-button.secondary:hover {
  background-color: #5a6268;
}

.form-button.link {
  background: none;
  color: #007bff;
  text-decoration: underline;
  padding: 0;
}

.form-button.link:hover {
  color: #0056b3;
}

@media (max-width: 480px) {
  .auth-form {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .form-input {
    padding: 0.5rem;
  }

  .form-button {
    padding: 0.5rem;
  }
}
</style>
