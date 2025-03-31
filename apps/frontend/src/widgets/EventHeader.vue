<template>
  <header class="flex flex-col px-20 pt-2.5 w-full bg-slate-800 max-md:px-5 max-md:max-w-full">
    <nav class="flex z-10 flex-col self-center mt-0 w-full max-w-[1720px] max-md:max-w-full">
      <div
        class="flex flex-wrap gap-5 justify-between items-start w-full max-w-[1456px] max-md:max-w-full"
      >
        <h1 class="px-16 pt-4 pb-2.5 text-5xl text-yellow-300 whitespace-nowrap max-md:text-4xl">
          Eventify
        </h1>

        <div
          class="flex flex-wrap gap-10 mt-2 text-2xl font-medium text-center text-white max-md:max-w-full"
        >
          <nav
            class="flex flex-wrap gap-7 items-start whitespace-nowrap min-h-[60px] max-md:max-w-full"
          >
            <a class="gap-2.5 py-2.5 pr-2.5 pl-3" href="#">Home</a>
            <a class="gap-2.5 py-2.5 pr-2.5 pl-3" href="#">Events</a>
            <a class="gap-2.5 py-2.5 pr-2.5 pl-3" href="#">About</a>
            <a class="gap-2.5 py-2.5 pr-2.5 pl-3" href="#">Contact</a>
          </nav>

          <button class="gap-2.5 self-start px-5 py-2.5">Create Event</button>
        </div>
      </div>

      <div
        class="flex overflow-hidden z-10 flex-col items-end self-end mt-0 max-w-full h-[67px] w-[260px]"
      >
        <div
          class="flex flex-col px-px pt-7 text-sm font-semibold text-center text-white whitespace-nowrap w-[68px]"
        >
          <img
            class="object-contain self-end w-2.5 aspect-[1.43] fill-white"
            src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/158043203e041a0d7101783f7cb825702ed2c67392f11ed67d5735ce93666d90?placeholderIfAbsent=true"
          />
          <button class="z-10 self-start mt-3">Profile</button>
        </div>

        <div class="overflow-hidden pb-0.5 mt-2 w-full bg-white rounded-xl shadow-sm max-w-[260px]">
          <div class="flex gap-2.5 py-5 w-full min-h-0 bg-white"></div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventHeader'
});
</script>
