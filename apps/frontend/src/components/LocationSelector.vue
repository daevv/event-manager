<template>
  <div class="flex flex-col gap-5 mb-5">
    <div
      v-for="option in props.options"
      :key="option.value"
      :class="{
        'border-2 border-slate-800 rounded-lg': props.modelValue === option.value
      }"
      class="flex gap-5 px-4 py-3.5 bg-white cursor-pointer"
      @click="emit('update:modelValue', option.value)"
    >
      <div class="flex items-center">
        <img :src="option.icon" alt="" class="h-[30px] w-[30px]" />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-2xl font-semibold text-gray-800">
          {{ option.title }}
        </h3>
        <p class="text-xl text-zinc-600">
          {{ option.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LocationSelector'
});
</script>

<script lang="ts" setup>
interface LocationOption {
  title: string;
  description: string;
  icon: string;
  value: 'venue' | 'online';
}

const props = defineProps<{
  options: LocationOption[];
  modelValue: 'venue' | 'online' | null;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (evt: 'update:modelValue', value: 'venue' | 'online'): void;
}>();
</script>
