<template>
  <div class="w-full">
    <div class="flex justify-between py-0.5 w-full">
      <label :for="id" class="text-base text-stone-500">{{ label }}</label>
      <button
        v-if="showHideToggle"
        class="text-lg text-right text-stone-500"
        type="button"
        @click="toggleVisibility"
      >
        {{ isVisible ? 'Hide' : 'Show' }}
      </button>
    </div>
    <input
      :id="id"
      :placeholder="placeholder"
      :type="inputType"
      :value="modelValue"
      class="flex mt-1 w-full rounded-xl border border-solid border-stone-500 border-opacity-30 min-h-14 px-4"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  modelValue: string;
  showHideToggle?: boolean;
}

const props = defineProps<InputProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const id = computed(() => `input-${Math.random().toString(36).slice(2)}`);
const isVisible = ref(false);

const inputType = computed(() => {
  if (!props.showHideToggle) return props.type || 'text';
  return isVisible.value ? 'text' : 'password';
});

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};
</script>
