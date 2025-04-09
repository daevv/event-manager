<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal">
      <button class="modal__close" @click="handleClose">×</button>
      <h2 class="modal__title">{{ props.title }}</h2>
      <p class="modal__text">{{ props.message }}</p>
      <div class="modal__actions">
        <button v-if="props.showConfirm" class="modal__btn" @click="handleConfirm">
          Подтвердить
        </button>
        <button v-if="props.showCancel" class="modal__btn modal__btn--cancel" @click="handleClose">
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    message: string;
    showCancel?: boolean;
    showConfirm?: boolean;
  }>(),
  {
    showCancel: false,
    showConfirm: true
  }
);

const emits = defineEmits(['confirm', 'close']);

function handleClose() {
  emits('close');
}

function handleConfirm() {
  emits('confirm');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal__close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal__title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.modal__text {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.modal__actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

.modal__btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

.modal__btn--cancel {
  background-color: #6c757d;
}
</style>
