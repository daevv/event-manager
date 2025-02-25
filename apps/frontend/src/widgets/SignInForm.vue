<template>
  <section
    class="flex overflow-hidden relative flex-col self-center px-8 pt-6 pb-20 mt-7 -mb-8 max-w-full bg-white rounded-3xl w-[539px] max-md:px-5 max-md:mb-2.5"
  >
    <img
      alt="Close"
      class="object-contain self-end w-6 aspect-square"
      src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/fbab80892461bcffba06e452ec704969961cef879755518b3750dea18ba09eef?placeholderIfAbsent=true"
    />

    <div class="mt-8 max-md:mr-2.5 max-md:max-w-full">
      <form class="flex flex-col justify-center w-full" @submit.prevent="handleSubmit">
        <h1 class="self-start text-3xl font-medium text-center text-zinc-800">Sign in</h1>

        <FormInput
          v-model="formData.email"
          class="mt-8"
          label="Email or phone number"
          type="email"
        />

        <FormInput
          v-model="formData.password"
          class="mt-8"
          label="Password"
          show-hide-toggle
          type="password"
        />

        <div class="mt-8 w-full">
          <FormButton full-width> Sign in </FormButton>

          <div class="flex items-center justify-between mt-2 text-base">
            <CheckboxField v-model="formData.rememberMe" label="Remember me" />
            <button class="text-zinc-800" type="button">Need help?</button>
          </div>
        </div>
      </form>

      <footer class="flex flex-col mt-16 max-w-full text-base w-[379px] max-md:mt-10">
        <p class="text-stone-500">
          Don't have an account?
          <button class="font-medium text-zinc-800" type="button">Sign up</button>
        </p>

        <p class="mt-2 text-stone-500">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
          <button class="text-black" type="button">Learn more</button>
        </p>
      </footer>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import CheckboxField from '@/components/CheckboxField.vue';

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
});

const handleSubmit = () => {
  // Handle form submission
  console.log('Form submitted:', formData.value);
};
</script>
