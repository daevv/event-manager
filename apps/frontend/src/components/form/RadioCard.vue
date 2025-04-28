<template>
  <label :class="['radio-card', { active: isActive }]">
    <input
      :checked="isActive"
      :value="value"
      class="radio-input"
      type="radio"
      v-bind="$attrs"
      @change="$emit('update:modelValue', value)"
    />
    <div class="card-content">
      <div class="card-icon">
        <slot name="icon">
          <component :is="iconComponent" v-if="iconComponent" />
        </slot>
      </div>
      <div class="card-text">
        <h4 class="card-title">{{ label }}</h4>
        <p class="card-description">{{ description }}</p>
      </div>
    </div>
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: true
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const isActive = computed(() => props.modelValue === props.value);

// Simple icon mapping - you might want to use a proper icon library
const iconComponent = computed(() => {
  switch (props.icon) {
    case 'location':
      return {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
          </svg>
        `
      };
    case 'video':
      return {
        template: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
          </svg>
        `
      };
    default:
      return null;
  }
});
</script>

<style scoped>
.radio-card {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.radio-card:hover {
  border-color: var(--color-primary-light);
}

.radio-card.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-lightest);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.radio-input {
  position: absolute;
  opacity: 0;
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  border-radius: 8px;
  flex-shrink: 0;
}

.radio-card.active .card-icon {
  background-color: var(--color-primary);
  color: white;
}

.card-text {
  text-align: left;
}

.card-title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.radio-card.active .card-title {
  color: var(--color-primary);
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
