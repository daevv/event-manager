<template>
  <section class="self-start mt-20 ml-28 max-md:mt-10 max-md:max-w-full">
    <h2 class="text-4xl font-bold text-gray-800">Hosted by</h2>
    <div class="flex gap-8 items-start mt-11 font-semibold max-md:mt-10 max-md:max-w-full">
      <img
        class="object-contain shrink-0 rounded-xl aspect-square w-[111px]"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6dfda07ac8fcb2c03428590171dc3339974444657a216dc95b8061352e358196?placeholderIfAbsent=true"
      />
      <div class="flex flex-col min-w-60">
        <h3 class="text-3xl text-gray-800">City Youth Movement</h3>
        <div class="flex gap-3.5 items-start self-start mt-7 text-center">
          <button
            class="overflow-hidden px-5 py-2 text-2xl whitespace-nowrap bg-white rounded-md border border-solid border-[color:var(--Assignment-1-Dark-Navy-Blue,#2B293D)] text-slate-800 w-[127px]"
          >
            Contact
          </button>
          <button
            class="overflow-hidden px-7 py-2.5 text-xl text-white rounded-md bg-slate-800 w-[132px] max-md:px-5"
          >
            + Follow
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventHost'
});
</script>
