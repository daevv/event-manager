<!-- @/shared/components/ZeroBlock.vue -->
<template>
  <div class="zero-block">
    <h2>{{ props.title }}</h2>
    <p v-if="props.subtitle">{{ props.subtitle }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ZeroBlock'
});
</script>

<script lang="ts" setup>
type ZeroBlockProps = {
  title: string;
  subtitle?: string;
};

const props = defineProps<ZeroBlockProps>();
</script>

<style scoped>
.zero-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 200px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: #666;
}
</style>
