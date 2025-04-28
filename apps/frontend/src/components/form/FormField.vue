<template>
  <div :class="{ 'full-width': fullWidth }" class="form-field">
    <label v-if="label" :for="id" class="field-label">
      {{ label }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>

    <div class="field-input-container">
      <input
        v-if="type !== 'textarea' && type !== 'select'"
        :id="id"
        v-model="inputValue"
        :min="min"
        :placeholder="placeholder"
        :required="required"
        :step="step"
        :type="type"
        class="field-input"
        @input="handleInput"
      />

      <textarea
        v-else-if="type === 'textarea'"
        :id="id"
        v-model="inputValue"
        :placeholder="placeholder"
        :required="required"
        class="field-input"
        rows="4"
        @input="handleInput"
      ></textarea>

      <select
        v-else-if="type === 'select'"
        :id="id"
        v-model="inputValue"
        class="field-input"
        @change="handleInput"
      >
        <option disabled selected value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
          <span v-if="option.subLabel"> - {{ option.subLabel }}</span>
        </option>
      </select>

      <div v-if="$slots.suffix" class="field-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>

    <div v-if="error" class="field-error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  },
  error: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array as () => Array<{ value: string | number; label: string; subLabel?: string }>,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const handleInput = () => {
  // Additional validation or formatting can be added here
};
</script>

<style scoped>
.form-field {
  margin-bottom: 1.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.required-asterisk {
  color: var(--color-danger);
  margin-left: 0.25rem;
}

.field-input-container {
  position: relative;
}

.field-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: white;
}

.field-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}

.field-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

textarea.field-input {
  min-height: 100px;
  resize: vertical;
}

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

.field-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.field-error {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-danger);
}
</style>
