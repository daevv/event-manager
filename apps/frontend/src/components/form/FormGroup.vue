<template>
  <div class="form-group">
    <label :for="props.id" class="label">
      {{ props.label }}
      <span v-if="props.required" class="required">*</span>
    </label>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormGroup'
});
</script>

<script lang="ts" setup>
const props = defineProps<{
  label: string;
  required?: boolean;
  id: string;
}>();
</script>

<style scoped>
.form-group {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.label {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  width: 215px;
  text-align: right;
}

.required {
  margin-left: 5px;
  color: #e11d48;
}

@media (max-width: 640px) {
  .form-group {
    flex-direction: column;
  }

  .label {
    width: auto;
    text-align: left;
    font-size: 18px;
  }
}
</style>
