<template>
  <section class="flex flex-col px-9 mt-10 w-full max-md:px-5 max-md:max-w-full">
    <div class="flex flex-wrap gap-10 w-full max-w-[1736px] max-md:max-w-full">
      <img
        class="object-contain shrink-0 self-start mt-6 rounded-xl aspect-square w-[50px]"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6c457ce5d89c482bda359d7848cafa7a56aef350ca4933aa687fc4d1933673bc?placeholderIfAbsent=true"
      />
      <img
        class="object-contain grow shrink-0 rounded-3xl aspect-[2.84] basis-0 w-fit max-md:max-w-full"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/11f8619ed0fa4c6b2393a2967d6081e7ba8c408c63490ca4faca322cb3137f1a?placeholderIfAbsent=true"
      />
    </div>

    <div
      class="flex flex-wrap gap-5 justify-between self-center mt-10 w-full max-w-[1620px] max-md:max-w-full"
    >
      <h1 class="text-7xl font-extrabold text-gray-800 max-md:max-w-full max-md:text-4xl">
        Sound Of Christmas 2023
      </h1>

      <div class="flex items-start self-start">
        <button class="flex items-center justify-center">
          <img
            class="object-contain shrink-0 aspect-square fill-white w-[90px]"
            src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/2718ea271c5bdedbbc2d87a9bcc129ef870dd2b922e8e93734b0fd902ae7d6db?placeholderIfAbsent=true"
          />
        </button>
        <button class="flex shrink-0 bg-white h-[90px] rounded-[70px] w-[90px]"></button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventBanner'
});
</script>
