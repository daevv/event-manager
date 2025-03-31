<template>
  <div class="form-field">
    <div v-if="props.icon" class="icon-container">
      <img v-if="typeof props.icon === 'string'" :src="props.icon" alt="icon" class="icon" />
      <div v-else v-html="props.icon"></div>
    </div>
    <input
      :placeholder="props.placeholder"
      :type="props.type"
      :value="props.modelValue"
      class="input-field"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormField'
});
</script>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  type?: string;
  icon?: string | { __html: string };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.form-field {
  position: relative;
  width: 900px;
}

.icon-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  background-color: #e4e4e7;
  border-right: 1px solid rgba(156, 163, 175, 0.7);
  border-radius: 50%;
}

.icon {
  width: 30px;
  height: 30px;
}

.input-field {
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 14px;
  padding-bottom: 14px;
  font-size: 20px;
  border-radius: 8px;
  border: 1px solid rgba(156, 163, 175, 0.7);
  width: 100%;
  font-size: 18px;
}

.input-field:focus {
  border-color: #9333ea;
}

@media (max-width: 640px) {
  .form-field {
    width: 100%;
  }

  .input-field {
    font-size: 16px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
  }

  .icon {
    width: 24px;
    height: 24px;
  }
}
</style>
