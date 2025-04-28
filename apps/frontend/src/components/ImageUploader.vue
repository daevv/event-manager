<template>
  <div class="image-uploader">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div
      :class="{ 'has-preview': previewUrl }"
      class="upload-area"
      @dragleave="dragover = false"
      @dragover.prevent="dragover = true"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        accept="image/jpeg, image/png"
        class="file-input"
        type="file"
        @change="handleFileChange"
      />

      <div v-if="!previewUrl" class="upload-content">
        <div class="upload-icon">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19Z"
              fill="currentColor"
            />
            <path
              d="M12 3L6.5 8.5L7.8 9.8L11 6.6V16H13V6.6L16.2 9.8L17.5 8.5L12 3Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p class="upload-text">Перетащите изображение или нажмите для выбора</p>
        <button class="upload-button" type="button" @click="triggerFileInput">
          Выбрать изображение
        </button>
      </div>

      <div v-else class="preview-content">
        <img :src="previewUrl" alt="Preview" class="preview-image" />
        <div class="preview-overlay">
          <button class="preview-button" type="button" @click="triggerFileInput">Изменить</button>
          <button class="preview-button danger" type="button" @click="removeImage">Удалить</button>
        </div>
      </div>

      <div v-if="dragover" class="drop-overlay">Отпустите для загрузки изображения</div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: File as unknown as () => File | null,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref<HTMLInputElement | null>(null);
const dragover = ref(false);
const previewUrl = ref('');
const error = ref('');

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    processFile(input.files[0]);
  }
};

const handleDrop = (e: DragEvent) => {
  dragover.value = false;
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    processFile(e.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  // Валидация типа файла
  if (!file.type.match('image/jpeg|image/png')) {
    error.value = 'Только JPG/PNG изображения';
    return;
  }

  // Валидация размера файла (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Изображение должно быть меньше 5MB';
    return;
  }

  error.value = '';

  // Освобождаем предыдущий URL, если он был
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  previewUrl.value = URL.createObjectURL(file);
  emit('update:modelValue', file);
};

const removeImage = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
  error.value = '';
  emit('update:modelValue', null);
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Очищаем URL при размонтировании компонента
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      removeImage();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.upload-area {
  position: relative;
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  min-height: 200px;
}

.upload-area.has-preview {
  padding: 0;
  border-color: transparent;
}

.upload-area:hover {
  border-color: var(--color-primary);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: var(--color-primary);
}

.upload-text {
  margin: 0;
  color: var(--color-text-muted);
}

.upload-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: var(--color-primary-dark);
}

.preview-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-content:hover .preview-overlay {
  opacity: 1;
}

.preview-button {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button:hover {
  background-color: white;
}

.preview-button.danger {
  background-color: rgba(255, 0, 0, 0.1);
  color: #ff4444;
}

.preview-button.danger:hover {
  background-color: rgba(255, 0, 0, 0.2);
}

.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  border: 2px dashed var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--color-primary);
  border-radius: 8px;
}

.error-message {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
