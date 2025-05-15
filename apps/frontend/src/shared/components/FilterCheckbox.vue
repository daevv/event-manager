<template>
  <label class="flex gap-2.5 items-start cursor-pointer">
    <div class="flex overflow-hidden flex-col justify-center px-px py-1 w-6">
      <input
        :checked="props.modelValue"
        class="flex shrink-0 rounded border-2 border-solid border-gray-800 border-opacity-50 h-[22px] w-[22px]"
        type="checkbox"
        @change="emit('update:modelValue', $event.target.checked)"
      />
    </div>
    <span class="text-xl text-slate-800 w-[250px]">{{ props.label }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FilterCheckbox'
});
</script>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>
