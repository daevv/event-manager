<template>
  <section class="form-section">
    <h2 class="section-title">{{ props.title }}</h2>
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormSection'
});
</script>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
}>();
</script>

<style scoped>
.form-section {
  margin: 40px 0;
}

.section-title {
  margin-bottom: 30px;
  font-size: 36px;
  color: #1f2937;
}

@media (max-width: 640px) {
  .section-title {
    font-size: 28px;
  }
}
</style>
