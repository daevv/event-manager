<template>
  <div class="tag-input-container">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="tag-input" @click="focusInput">
      <span v-for="(tag, index) in modelValue" :key="index" class="tag">
        {{ tag }}
        <button class="tag-remove" type="button" @click="removeTag(index)">×</button>
      </span>
      <input
        ref="input"
        v-model="inputValue"
        :placeholder="placeholder"
        class="tag-input-field"
        type="text"
        @blur="addTag"
        @keydown.enter="addTag"
        @keydown.backspace="handleBackspace"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const input = ref<HTMLInputElement | null>(null);
const inputValue = ref('');

const focusInput = () => {
  input.value?.focus();
};

const addTag = () => {
  if (inputValue.value.trim() && !props.modelValue.includes(inputValue.value.trim())) {
    emit('update:modelValue', [...props.modelValue, inputValue.value.trim()]);
    inputValue.value = '';
  }
};

const removeTag = (index: number) => {
  const newTags = [...props.modelValue];
  newTags.splice(index, 1);
  emit('update:modelValue', newTags);
};

const handleBackspace = () => {
  if (!inputValue.value && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1);
  }
};

watch(
  () => props.modelValue,
  () => {
    // Ensure the input stays visible when tags are added
    if (input.value) {
      input.value.style.width = 'auto';
      input.value.style.width = `${input.value.scrollWidth}px`;
    }
  }
);
</script>

<style scoped>
.tag-input-container {
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.tag-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  min-height: 48px;
  background: white;
  transition: border-color 0.2s;
}

.tag-input:focus-within {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 0.875rem;
  line-height: 1;
}

.tag-remove {
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
}

.tag-remove:hover {
  color: var(--color-primary-dark);
}

.tag-input-field {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  background: transparent;
}
</style>
