<template>
  <section class="mt-20 ml-28 max-w-full text-gray-800 w-[1149px] max-md:mt-10">
    <h2 class="text-4xl font-bold">Tags</h2>
    <div class="flex flex-wrap gap-7 items-start mt-9 w-full text-lg text-center max-md:max-w-full">
      <span class="px-7 py-3 bg-gray-50 rounded-[50px] max-md:px-5">Holiday Concert</span>
      <span class="px-7 py-3 bg-gray-50 rounded-[50px] max-md:px-5">Live Performance</span>
      <span class="px-7 py-3 bg-gray-50 rounded-[50px] max-md:px-5">Seasonal Event</span>
      <span class="px-7 py-3 whitespace-nowrap bg-gray-50 rounded-[50px] max-md:px-5"
        >Family-Friendly</span
      >
      <span class="px-7 py-3 whitespace-nowrap bg-gray-50 rounded-[50px] max-md:px-5"
        >#Christmas_Spirit</span
      >
      <span class="px-7 py-3 whitespace-nowrap bg-gray-50 rounded-[50px] max-md:px-5"
        >#Christmas_Carols</span
      >
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventTags'
});
</script>

<script lang="ts" setup></script>
