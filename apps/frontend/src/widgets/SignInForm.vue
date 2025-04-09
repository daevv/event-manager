<template>
  <section class="auth-section">
    <div class="auth-container">
      <form class="auth-form" @submit.prevent="handleSubmit">
        <h2 class="auth-form__title">Welcome Back 👋</h2>
        <p class="auth-form__subtitle">We are glad to see you and bla-bla bla-bla</p>

        <div class="input-wrapper">
          <FormInput
            v-model="formData.email"
            class="auth-form__email auth-form__input"
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
            class="auth-form__password auth-form__input"
            label="Password"
            placeholder="At least 8 symbols"
            type="password"
          />
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>

        <FormButton full-width> Sign in </FormButton>
      </form>

      <footer class="auth-footer">
        <p>Don't have an account?</p>
        <FormButton full-width variant="secondary" @click="emit('on-sign-up')">
          Sign up
        </FormButton>
      </footer>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FormInput from '@/components/form/FormInput.vue';
import FormButton from '@/components/form/FormButton.vue';
import router, { RouteNames } from '@/router';
import axios from 'axios';
import axiosInstance from '@/axiosInstance';

const emit = defineEmits<{
  (evt: 'on-sign-up'): void;
}>();

const formData = ref({
  email: '',
  password: '',
  rememberMe: false // Пока не используется, но оставлено для возможного расширения
});

const errors = ref({
  email: '',
  password: ''
});

// Email validation: checks if the email is in a valid format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation: at least 8 characters, 1 digit, 1 special character, 1 uppercase, 1 lowercase
const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Detailed password error message
const getPasswordErrorMessage = (password: string): string => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one digit';
  }
  if (!/[@$!%*?&]/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  return '';
};

const handleSubmit = async () => {
  // Reset errors
  errors.value.email = '';
  errors.value.password = '';

  let isValid = true;

  // Validate email
  if (!formData.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate password
  if (!formData.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (!validatePassword(formData.value.password)) {
    errors.value.password = getPasswordErrorMessage(formData.value.password);
    isValid = false;
  }

  if (isValid) {
    try {
      const payload = {
        email: formData.value.email,
        password: formData.value.password
      };

      // Send login request to the backend
      const response = await axiosInstance.post('auth/login', payload);

      // Successful login: save token and redirect
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      router.push({ name: RouteNames.HOME });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'An error occurred during login';

      errors.value.email = errorMessage;
    }
  }
};
</script>

<style scoped>
.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 50%;
}

.auth-container {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
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

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-message {
  color: #e63946; /* Red color for error messages */
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
