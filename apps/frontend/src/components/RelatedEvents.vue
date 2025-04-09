<template>
  <section class="self-start mt-14 ml-28 max-md:mt-10 max-md:max-w-full">
    <h2 class="text-4xl font-bold text-gray-800">Other events you may like</h2>
    <div
      class="flex flex-wrap gap-10 self-end mt-12 w-full max-w-[1800px] max-md:mt-10 max-md:max-w-full"
    >
      <button
        class="object-contain shrink-0 my-auto aspect-square fill-white stroke-[1px] stroke-slate-800 w-[50px]"
      >
        <img
          alt="Previous"
          src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/04a95a667466f954b90164dbdcd40b1191e24f8db52165141fcf926da61078eb?placeholderIfAbsent=true"
        />
      </button>

      <div class="flex flex-auto gap-10 items-start overflow-x-auto max-md:max-w-full">
        <EventCard v-for="event in relatedEvents" :key="event.title" :event="event" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RelatedEvents'
});
</script>

<script lang="ts" setup>
import EventCard from '@/entities/EventCard.vue';

interface RelatedEventType {
  title: string;
  venue: string;
  date: {
    month: string;
    day: string | number;
    endDay?: string | number;
  };
  time: string;
  price: string;
  category: string;
  image: string;
  interestedCount?: number;
}

const relatedEvents: RelatedEventType[] = [
  {
    title: 'Lakeside Camping at Pawna',
    venue: 'Adventure Geek - Explore the Unexplored, Mumbai',
    date: {
      month: 'NOV',
      day: '25',
      endDay: '26'
    },
    time: '8:30 AM - 7:30 PM',
    price: 'INR 1,400',
    category: 'Travel & Adventure',
    image:
      'https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/2532072ab1dd433e5e22d89a5268b71f956d4fc6d697afd3e57c4df107a7a540?placeholderIfAbsent=true',
    interestedCount: 14
  },
  {
    title: 'Project Earth Exhibition-Christmas and Party Edit',
    venue: 'World Trade Centre, Mumbai',
    date: {
      month: 'DEC',
      day: '16'
    },
    time: '11 AM - 7 PM',
    price: 'FREE',
    category: 'Cultural & Arts',
    image:
      'https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/c6ade091f5125ea0fa51587756664c7bdf75d0f719e04420929ef42b75feb532?placeholderIfAbsent=true'
  },
  {
    title: 'Meet the Royal College of Art in Mumbai 2023',
    venue: 'Sofitel Mumbai BKC, Mumbai',
    date: {
      month: 'DEC',
      day: '02'
    },
    time: '10 AM - 5 PM',
    price: 'FREE',
    category: 'Educational & Business',
    image:
      'https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/edf17d4336b77ca302e2536eecaec197a53a549afcbba7388a9e3a0ae24f4fb1?placeholderIfAbsent=true'
  }
];
</script>
