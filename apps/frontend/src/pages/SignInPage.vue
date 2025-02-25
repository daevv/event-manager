<template>
  <main class="overflow-hidden bg-white">
    <div
      class="flex overflow-hidden relative flex-col pt-10 pr-20 pb-40 pl-10 w-full min-h-[1024px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
    >
      <img
        alt="Background"
        class="object-cover absolute inset-0 size-full"
        src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/2a3d8d30a6123976431de2548f9f614e1ab6623ebc13b876f871d772aab4b61c?placeholderIfAbsent=true"
      />

      <div class="flex relative shrink-0 w-16 h-16 rounded-full bg-stone-300">
        <!-- Logo placeholder -->
      </div>

      <SignInForm />
    </div>
  </main>
</template>

<script lang="ts" setup>
import SignInForm from '@/widgets/SignInForm.vue';
</script>
