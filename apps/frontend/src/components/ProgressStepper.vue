<template>
  <div class="progress-stepper">
    <div
      v-for="(step, index) in steps"
      :key="index"
      :class="{
        step: true,
        active: index === currentStep,
        completed: index < currentStep
      }"
    >
      <div class="step-icon">
        <span v-if="index < currentStep">✓</span>
        <span v-else>{{ index + 1 }}</span>
      </div>
      <div class="step-label">{{ step.title }}</div>
      <div v-if="index < steps.length - 1" class="step-connector"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  steps: {
    type: Array as () => Array<{ title: string; icon?: string }>,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.progress-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  color: var(--color-text-muted);
  font-weight: 500;
  margin-bottom: 0.5rem;
  border: 2px solid var(--color-border);
  transition: all 0.3s ease;
}

.step.active .step-icon {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: white;
}

.step.completed .step-icon {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.step-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
  transition: all 0.3s ease;
}

.step.active .step-label {
  color: var(--color-primary);
  font-weight: 500;
}

.step-connector {
  position: absolute;
  top: 15px;
  left: calc(50% + 16px);
  right: calc(-50% + 16px);
  height: 2px;
  background-color: var(--color-border);
  z-index: -1;
}

.step.completed .step-connector {
  background-color: var(--color-primary);
}

@media (max-width: 768px) {
  .step-label {
    font-size: 0.7rem;
  }
}
</style>
