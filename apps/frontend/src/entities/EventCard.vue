<template>
  <article class="min-w-60 w-[512px] max-md:max-w-full">
    <div
      class="flex overflow-hidden flex-col justify-center pb-12 w-full max-w-lg bg-white rounded-xl max-md:max-w-full"
    >
      <div
        class="flex overflow-hidden relative flex-col pt-3.5 pr-3.5 w-full text-lg font-semibold text-gray-800 min-h-[254px] max-md:max-w-full"
      >
        <img :src="event.image" class="object-cover absolute inset-0 size-full" />
        <img
          class="object-contain self-end w-12 aspect-square fill-white"
          src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/9c1046de208fdc3515ce14eddbcf778ad27b67628f7ecbfaa210063a9427c5c9?placeholderIfAbsent=true"
        />
        <span
          class="overflow-hidden relative gap-2.5 self-start px-2.5 py-1.5 mt-40 bg-yellow-300 rounded-none max-md:mt-10"
        >
          {{ event.category }}
        </span>
      </div>

      <div class="self-center mt-5 max-w-full w-[466px]">
        <div class="flex gap-5 max-md:flex-col">
          <div class="w-[18%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col items-center mt-1 text-center whitespace-nowrap max-md:mt-6">
              <time :datetime="event.date.month">
                <span class="text-2xl font-semibold text-indigo-700">{{ event.date.month }}</span>
                <div
                  class="flex gap-1 justify-center items-center mt-1.5 text-2xl font-bold text-gray-800"
                >
                  <span>{{ event.date.day }}</span>
                  <span v-if="event.date.endDay">-</span>
                  <span v-if="event.date.endDay">{{ event.date.endDay }}</span>
                </div>
              </time>
            </div>
          </div>

          <div class="ml-5 w-[82%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col w-full text-lg font-semibold text-zinc-600 max-md:mt-5">
              <h3 class="text-2xl text-gray-800 text-ellipsis">
                {{ event.title }}
              </h3>
              <p class="mt-2.5 text-ellipsis">{{ event.venue }}</p>
              <time :datetime="event.time" class="mt-2.5 uppercase">{{ event.time }}</time>
              <div class="flex gap-2.5 items-center self-start mt-2.5">
                <div class="flex gap-2 items-start self-stretch my-auto">
                  <img
                    class="object-contain shrink-0 aspect-square w-[22px]"
                    src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6b2e99629d6890130fe23bbddccb99bf0e7b762907c94ba901f6f501e67f1f47?placeholderIfAbsent=true"
                  />
                  <span class="text-ellipsis">{{ event.price }}</span>
                </div>
                <div
                  v-if="event.interestedCount"
                  class="flex gap-1 items-center self-stretch my-auto"
                >
                  <img
                    class="object-contain shrink-0 self-stretch my-auto rounded-sm aspect-square w-[21px]"
                    src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/0652e1d7fb40fc37b6a2cdc0af2f3f40dda735dfda3afea7ff55ead5950cc291?placeholderIfAbsent=true"
                  />
                  <span class="self-stretch my-auto text-ellipsis"
                    >{{ event.interestedCount }} interested</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { RelatedEventType } from './types';

export default defineComponent({
  name: 'RelatedEventCard',
  props: {
    event: {
      type: Object as PropType<RelatedEventType>,
      required: true
    }
  }
});
</script>
