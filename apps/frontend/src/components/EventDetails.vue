<template>
  <section
    class="flex flex-wrap gap-10 self-center mt-16 w-full max-w-[1620px] max-md:mt-10 max-md:max-w-full"
  >
    <div class="flex-1 my-auto">
      <div class="text-gray-800">
        <h2 class="text-4xl font-bold">Date and Time</h2>
        <div class="flex flex-col mt-7 text-2xl font-semibold">
          <div class="flex gap-5 items-end">
            <img
              class="object-contain shrink-0 aspect-square w-[30px]"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/a769eaaa592ccfa00532c8f3f577aa54e34da3569a4704e7cff1823eb386e616?placeholderIfAbsent=true"
            />
            <time datetime="2023-12-02">Saturday, 2 December 2023</time>
          </div>
          <div class="flex gap-5 items-end self-start mt-6">
            <img
              class="object-contain shrink-0 aspect-square w-[30px]"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/c1ca989441f20d3ec70e46014e22db5cba0b7476d22f6a652ac5130cda6c8cc8?placeholderIfAbsent=true"
            />
            <time datetime="18:30">6:30 PM - 9:30 PM</time>
          </div>
        </div>
      </div>
      <button
        class="gap-2.5 self-stretch pl-8 mt-6 max-w-full text-2xl font-semibold text-indigo-700 w-[239px] max-md:pl-5"
      >
        + Add to Calendar
      </button>
    </div>

    <div class="flex flex-col flex-1">
      <button
        class="flex gap-3 justify-center items-center self-end px-16 py-5 text-3xl font-semibold text-center bg-yellow-300 rounded-xl text-slate-800 max-md:px-5"
      >
        <img
          class="object-contain shrink-0 self-stretch my-auto w-11 aspect-square"
          src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/3f6bf85539020cf18cffd3c2cf891337c50baec17708a3dbf69f540cf0a03d81?placeholderIfAbsent=true"
        />
        <span class="self-stretch my-auto">Buy Tickets</span>
      </button>

      <div class="mt-16 text-gray-800 max-md:mt-10">
        <h2 class="text-4xl font-bold">Ticket Information</h2>
        <div class="mt-7 w-full text-2xl font-semibold max-w-[382px]">
          <div class="flex gap-5 items-center w-full">
            <img
              class="object-contain shrink-0 self-stretch my-auto aspect-square w-[30px]"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/f6aba3f6875cd7fe0934c49ee2e912f43f7fc39cdd38108ff6341c83abfd9382?placeholderIfAbsent=true"
            />
            <p class="self-stretch my-auto w-[846px] max-md:max-w-full">
              Standard Ticket: ₹ 200 each
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventDetails'
});
</script>
