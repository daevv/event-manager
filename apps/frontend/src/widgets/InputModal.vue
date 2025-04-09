<template>
  <div v-if="visible" class="modal-overlay" @click.self="cancel">
    <div class="modal-window">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="cancel">×</button>
      </header>
      <div class="modal-body">
        <p>{{ message }}</p>
        <input v-model="input" class="modal-input" placeholder="Email пользователя" type="email" />
      </div>
      <footer class="modal-footer">
        <button @click="cancel">Отменить</button>
        <button @click="submit">Подтвердить</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  title: string;
  message: string;
}>();

const emit = defineEmits(['submit', 'cancel']);
const input = ref('');

watch(
  () => props.visible,
  (val) => {
    if (!val) input.value = '';
  }
);

const submit = () => {
  emit('submit', input.value);
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 1000;
}
.modal-window {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  margin-top: 10px;
}
.modal-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
