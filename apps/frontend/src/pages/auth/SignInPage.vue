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
.container {
  display: flex;
  gap: 2rem;
  height: 90vh;
  justify-content: space-between;

  .auth-page__bg {
    background: url('../../assets/images/auth_bg.jpeg') no-repeat center;
    background-size: cover;
    height: 100%;
    border-radius: 24px;
    width: 50%;
  }
}
</style>
