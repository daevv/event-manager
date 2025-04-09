<template>
  <section class="flex flex-col items-start">
    <h3
      class="gap-10 self-stretch max-w-full text-2xl font-semibold text-gray-800 whitespace-nowrap w-[266px]"
    >
      {{ props.title }}
    </h3>
    <div class="mt-8">
      <div class="overflow-hidden min-h-[207px]">
        <FilterCheckbox
          v-for="filter in props.filters"
          :key="filter.id"
          v-model="filter.checked"
          :label="filter.label"
          class="mt-5 first:mt-0"
        />
      </div>
      <button v-if="props.showMore" class="mt-5 text-2xl text-indigo-700">More</button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FilterSection'
});
</script>

<script lang="ts" setup>
import FilterCheckbox from './FilterCheckbox.vue';

interface Filter {
  id: string;
  label: string;
  checked: boolean;
}

const props = defineProps<{
  title: string;
  filters: Filter[];
  showMore?: boolean;
}>();
</script>
