<template>
  <button
    :class="[
      'button',
      { 'button--full-width': props.fullWidth, 'button--secondary': props.variant === 'secondary' }
    ]"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormButton'
});
</script>

<script lang="ts" setup>
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  fullWidth: true
});
</script>

<style scoped>
.button {
  padding: 12px 24px; /* Padding for a comfortable click area */
  font-size: 16px;
  font-weight: 500;
  color: #ffffff; /* White text */
  background-color: #1a2a44; /* Dark background color matching the image */
  border: none; /* No border */
  border-radius: 8px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.2s ease; /* Smooth transition for hover effect */
}

.button:hover {
  background-color: #2c3e66; /* Slightly lighter shade on hover */
}

.button--full-width {
  width: 100%; /* Full width if the prop is set */
}

.button--secondary {
  background-color: #e0e4e8; /* Lighter background for secondary variant */
  color: #333; /* Darker text for contrast */
}

.button--secondary:hover {
  background-color: #d1d5db; /* Slightly darker on hover for secondary */
}

.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 42, 68, 0.2); /* Subtle focus ring matching the button color */
}
</style>
