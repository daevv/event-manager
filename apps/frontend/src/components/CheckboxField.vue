<template>
  <label class="flex gap-2 items-start self-stretch py-2 pr-2 cursor-pointer">
    <input
      :checked="modelValue"
      class="hidden"
      type="checkbox"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <img
      :src="
        modelValue
          ? 'https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/51eefca2c79839e29c2f98c3538c67599fe5ec46748402b1e47dcaa848aa5ab7?placeholderIfAbsent=true'
          : 'https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/51eefca2c79839e29c2f98c3538c67599fe5ec46748402b1e47dcaa848aa5ab7?placeholderIfAbsent=true'
      "
      alt=""
      class="object-contain shrink-0 w-6 aspect-square"
    />
    <span class="text-base text-zinc-800">{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
interface CheckboxProps {
  label: string;
  modelValue: boolean;
}

defineProps<CheckboxProps>();
defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>
