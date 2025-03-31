<template>
  <button
    :class="{ 'w-full': fullWidth }"
    class="flex overflow-hidden flex-col justify-center items-center px-16 py-4 w-full text-lg text-center text-white bg-neutral-900 rounded-[32px] hover:bg-neutral-800 transition-colors"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

defineProps<ButtonProps>();
</script>
