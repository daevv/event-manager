<template>
  <main class="auth-page">
    <div class="container">
      <SignInForm v-if="isSignInState" @on-sign-up="handleSwitch" />
      <SignUpForm v-else @on-sign-in="handleSwitch" />
      <div class="auth-page__bg" />
    </div>
    <ConfirmModal
      v-if="showConfirmModal"
      :message="'Чтобы войти в свой аккаунт, подтвердите email.'"
      :showConfirm="false"
      :title="'Подтверждение Email'"
      @close="showConfirmModal = false"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SignInPage'
});
</script>

<script lang="ts" setup>
import SignInForm from '@/pages/auth/SignInForm.vue';
import SignUpForm from '@/pages/auth/SignUpForm.vue';
import { ref } from 'vue';
import ConfirmModal from '@/widgets/modals/ConfirmModal.vue';

const isSignInState = ref<boolean>(false);
const showConfirmModal = ref<boolean>(false);

function handleSwitch(withConfirmEmailModal = false): void {
  isSignInState.value = !isSignInState.value;
  if (withConfirmEmailModal) showConfirmModal.value = true;
}
</script>

<style scoped>
.auth-page {
  padding: 60px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5; /* Светлый фон для улучшения контраста */
}

.container {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  height: 90vh;
  margin: 0 auto;
  padding: 0 1rem;
  justify-content: space-between;
  align-items: stretch;
}

/* Стили для формы (SignInForm/SignUpForm) */
.container :deep(.sign-in-form),
.container :deep(.sign-up-form) {
  flex: 1;
  max-width: 500px;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Фоновое изображение */
.auth-page__bg {
  background: url('../../assets/images/auth_bg.jpeg') no-repeat center;
  background-size: cover;
  height: 70%;
  border-radius: 24px;
  width: 50%;
  transition: opacity 0.3s ease;
}

/* Медиазапросы для адаптивности */

/* Планшеты (ширина до 1024px) */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    height: auto;
    gap: 1rem;
    padding: 1rem;
  }

  .container :deep(.sign-in-form),
  .container :deep(.sign-up-form) {
    max-width: 100%;
    width: 100%;
  }

  .auth-page__bg {
    width: 100%;
    height: 300px; /* Фиксированная высота для фона на планшетах */
    border-radius: 16px;
  }
}

/* Мобильные устройства (ширина до 768px) */
@media (max-width: 768px) {
  .auth-page {
    padding: 20px 0;
  }

  .container {
    padding: 0 0.5rem;
    gap: 0.5rem;
  }

  .container :deep(.sign-in-form),
  .container :deep(.sign-up-form) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .auth-page__bg {
    display: none; /* Скрываем фоновое изображение на мобильных */
  }
}

/* Очень маленькие экраны (ширина до 480px) */
@media (max-width: 480px) {
  .container :deep(.sign-in-form),
  .container :deep(.sign-up-form) {
    padding: 1rem;
  }

  .auth-page {
    padding: 10px 0;
  }
}

/* Стили для модального окна */
:deep(.confirm-modal) {
  max-width: 90%;
  width: 400px;
  padding: 1.5rem;
  border-radius: 12px;
}

/* Анимация переключения форм */
.container :deep(.sign-in-form),
.container :deep(.sign-up-form) {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.container :deep(.sign-in-form.fade-out),
.container :deep(.sign-up-form.fade-out) {
  opacity: 0;
  transform: translateY(20px);
}
</style>
