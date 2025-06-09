<template>
  <label :class="['switch-card', { active: isActive }]">
    <input
      :checked="isActive"
      class="switch-input"
      type="checkbox"
      v-bind="$attrs"
      @change="$emit('update:modelValue', !isActive)"
    />
    <div class="card-content">
      <div class="card-text">
        <h4 class="card-title">{{ label }}</h4>
        <p class="card-description">{{ description }}</p>
      </div>
      <div class="switch-toggle">
        <span class="switch-slider"></span>
      </div>
    </div>
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  label: string;
  description?: string;
  icon?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isActive = computed(() => props.modelValue);
</script>

<style scoped>
.switch-card {
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

.switch-card:hover {
  border-color: var(--color-primary-light);
}

.switch-card.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-lightest);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.switch-input {
  position: absolute;
  opacity: 0;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-text {
  flex: 1;
  text-align: left;
}

.card-title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.switch-card.active .card-title {
  color: var(--color-primary);
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.switch-toggle {
  width: 40px;
  height: 24px;
  background-color: var(--color-border);
  border-radius: 12px;
  position: relative;
  transition: background-color 0.2s ease;
}

.switch-toggle .switch-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.switch-card.active .switch-toggle {
  background-color: var(--color-primary);
}

.switch-card.active .switch-toggle .switch-slider {
  transform: translateX(16px);
}
</style>
