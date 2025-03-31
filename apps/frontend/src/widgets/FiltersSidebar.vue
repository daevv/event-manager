<template>
  <aside class="flex flex-col">
    <h2 class="self-start text-3xl font-semibold text-black">Filters</h2>
    <div class="mt-12 max-md:mt-10">
      <FilterSection :filters="priceFilters" title="Price" />
      <FilterSection :filters="dateFilters" :show-more="true" class="mt-10" title="Date" />
      <FilterSection :filters="categoryFilters" :show-more="true" class="mt-10" title="Category" />
      <FilterSection :filters="formatFilters" :show-more="true" class="mt-10" title="Format" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Filter } from './types';
import FilterSection from './FilterSection.vue';

const priceFilters = ref<Filter[]>([
  { id: 'free', label: 'Free', checked: false },
  { id: 'paid', label: 'Paid', checked: false }
]);

const dateFilters = ref<Filter[]>([
  { id: 'today', label: 'Today', checked: false },
  { id: 'tomorrow', label: 'Tomorrow', checked: false },
  { id: 'this-week', label: 'This Week', checked: false },
  { id: 'this-weekend', label: 'This Weekend', checked: false },
  { id: 'pick-date', label: 'Pick a Date', checked: false }
]);

const categoryFilters = ref<Filter[]>([
  { id: 'adventure', label: 'Adventure Travel', checked: false },
  { id: 'art', label: 'Art Exhibitions', checked: false },
  { id: 'auctions', label: 'Auctions & Fundraisers', checked: false },
  { id: 'beer', label: 'Beer Festivals', checked: false },
  { id: 'benefit', label: 'Benefit Concerts', checked: false }
]);

const formatFilters = ref<Filter[]>([
  { id: 'community', label: 'Community Engagement', checked: false },
  { id: 'concerts', label: 'Concerts & Performances', checked: false },
  { id: 'conferences', label: 'Conferences', checked: false },
  { id: 'experiential', label: 'Experiential Events', checked: false },
  { id: 'festivals', label: 'Festivals & Fairs', checked: false }
]);
</script>
