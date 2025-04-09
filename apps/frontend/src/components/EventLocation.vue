<template>
  <section class="flex flex-col mt-14 ml-28 max-w-full w-[730px] max-md:mt-10">
    <div class="self-start text-gray-800 max-md:max-w-full">
      <h2 class="text-4xl font-bold">Location</h2>
      <div class="mt-7 text-2xl font-semibold max-md:max-w-full">
        <address class="flex flex-wrap gap-5 items-start max-md:max-w-full not-italic">
          <img
            class="object-contain shrink-0 aspect-square w-[30px]"
            src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/2abcde1997b9b976f171cb2d855dbcbdca7c2148766a08cd6558eddef0baa11b?placeholderIfAbsent=true"
          />
          <p class="w-[561px] max-md:max-w-full">
            Bal Gandharva Rang Mandir, Near Junction Of 24th & 32nd Road & Patwardhan Park,Off
            Linking Road, Bandra West., Mumbai, India
          </p>
        </address>
      </div>
    </div>

    <div
      class="flex overflow-hidden relative flex-col items-end py-8 pr-8 pl-20 mt-8 w-full rounded-xl min-h-[450px] max-md:px-5"
    >
      <img
        class="object-cover absolute inset-0 size-full"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6266cfc3801e69b539c268fdedbdc76cb2fe74dcd3aee477a7cb3299f413efa3?placeholderIfAbsent=true"
      />
      <img
        class="object-contain aspect-square fill-white w-[52px]"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6b8fbd55abf51349fdd968e2a179159b2237e59a047fc46b18f8e78b31542919?placeholderIfAbsent=true"
      />
      <img
        class="object-contain self-center mt-28 max-w-full aspect-square w-[100px] max-md:mt-10"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/310a6ee094af102c81ba126a82f031335fa5512772a18b1789c55f07c9e7a63d?placeholderIfAbsent=true"
      />
      <img
        class="object-contain mt-1 shadow-sm aspect-[0.46] w-[53px]"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/b5a2823d5f9b9b3f69e3bd5e621e81fd01d6a9de012fb71d4f9e93fa0a7ce764?placeholderIfAbsent=true"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventLocation'
});
</script>

<script lang="ts" setup></script>
