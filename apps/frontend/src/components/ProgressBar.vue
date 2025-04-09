<template>
  <div class="progress-bar">
    <div class="progress-track">
      <div :style="{ width: progressPercentage + '%' }" class="progress-fill"></div>
    </div>
    <div class="progress-steps">
      <template v-for="(step, index) in steps" :key="index">
        <div
          :class="{
            'step-completed': index < activeStep,
            'step-active': index === activeStep,
            'step-upcoming': index > activeStep
          }"
          class="step"
        >
          <span class="step-number">{{ index + 1 }}</span>
          <span class="step-title">{{ step.title }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  steps: {
    type: Array as () => { title: string; isCompleted: boolean }[],
    required: true
  },
  activeStep: {
    type: Number,
    required: true
  }
});

const progressPercentage = computed(() => {
  return ((props.activeStep + 1) / props.steps.length) * 100;
});
</script>

<style scoped>
.progress-bar {
  width: 100%;
  margin: 30px 0;
  position: relative;
}

.progress-track {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #facc15;
  transition: width 0.4s ease;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: -14px;
  width: 100%;
}

.step {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-number {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 50%;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-title {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: #4b5563;
}

.step-completed .step-number {
  background-color: #facc15;
  color: white;
}

.step-active .step-number {
  background-color: #facc15;
  color: white;
  box-shadow: 0 0 6px rgba(250, 204, 21, 0.6);
}

.step-upcoming .step-number {
  background-color: #e5e7eb;
  color: #9ca3af;
}

.step-upcoming {
  cursor: default;
}
</style>
