<script lang="ts" setup>
import { RouterView } from 'vue-router';
import EventHeader from '@/widgets/EventHeader.vue';
import FooterSection from '@/widgets/FooterSection.vue';
</script>

<template>
  <EventHeader />
  <RouterView />
  <FooterSection />
</template>
