<template>
  <div class="input-container">
    <div class="input-container__info-block">
      <label :for="id" class="input-label">{{ label }}</label>
      <button v-if="showInputToggle" class="input-toggle" type="button" @click="toggleVisibility">
        {{ isVisible ? 'Скрыть' : 'Показать' }}
      </button>
    </div>
    <input
      :id="id"
      :placeholder="placeholder"
      :type="inputType"
      :value="modelValue"
      class="input"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormInput'
});
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  modelValue: string;
  showInputToggle?: boolean;
}

const props = defineProps<InputProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const id = computed<string>(() => `input-${Math.random().toString(36).slice(2)}`);
const isVisible = ref(false);

const inputType = computed(() => {
  if (!props.showInputToggle) return props.type || 'text';
  return isVisible.value ? 'text' : 'password';
});

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Space between label and input */
  width: 100%;
  max-width: 400px; /* Adjust as needed */
}

.input-container__info-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-label {
  font-size: 16px;
  font-weight: 600;
  color: #333; /* Dark color for the label */
}

.input-toggle {
  background: none;
  border: none;
  color: #007bff; /* Blue color for the toggle button */
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.input-toggle:hover {
  text-decoration: underline;
}

.input {
  padding: 10px 12px; /* Padding inside the input */
  font-size: 16px;
  color: #666; /* Text color for the placeholder and input */
  background-color: #f5f7fa; /* Light background color */
  border: 1px solid #e0e4e8; /* Subtle border */
  border-radius: 8px; /* Rounded corners */
  outline: none; /* Remove default outline */
  width: 100%;
  box-sizing: border-box; /* Ensure padding doesn't affect width */
}

.input::placeholder {
  color: #999; /* Placeholder color */
}

.input:focus {
  border-color: #007bff; /* Blue border on focus */
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1); /* Subtle focus ring */
}
</style>
