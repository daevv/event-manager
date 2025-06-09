<template>
  <div class="create-event-page">
    <main class="main-content">
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">Создать новое мероприятие</h1>
          <ProgressStepper :current-step="activeStep" :steps="steps" />
        </div>

        <form class="event-form" @submit.prevent>
          <!-- Step 1: Basic Information -->
          <div v-if="activeStep === 0" class="form-step">
            <div class="form-grid">
              <FormField
                v-model="formData.title"
                class="full-width"
                label="Название мероприятия"
                placeholder="Введите название мероприятия"
                required
              />

              <FormField
                v-model="formData.description"
                class="full-width"
                label="Описание"
                placeholder="Расскажите о событии, чтобы на него пришли больше людей"
                required
                type="textarea"
              />

              <TagInput
                v-model="formData.categories"
                class="full-width"
                label="Категории"
                placeholder="Добавьте категории (нажмите 'Enter' чтобы добавить)"
              />

              <div class="event-type-selector full-width">
                <RadioCard
                  v-model="formData.isOnline"
                  :value="true"
                  description="Мероприятие на онлайн-платформе"
                  icon="video"
                  label="Онлайн мероприятие"
                />
                <RadioCard
                  v-model="formData.isOnline"
                  :value="false"
                  description="Живое общение"
                  icon="location"
                  label="Публичное оффлайн мероприятие"
                />
              </div>

              <LocationPicker
                v-if="!formData.isOnline"
                v-model="formData.location"
                class="full-width"
              />
              <FormField
                v-else
                v-model="formData.meetingUrl"
                class="full-width"
                label="Ссылка на событие"
                placeholder="Введите ссылку на событие"
                required
              />
            </div>
          </div>

          <!-- Step 2: Event Image -->
          <div v-if="activeStep === 1" class="form-step">
            <ImageUploader v-model="formData.imageFile" label="Event Cover Image" required />
          </div>

          <!-- Step 3: Event Details -->
          <div v-if="activeStep === 2" class="form-step">
            <div class="form-grid">
              <FormSwitch
                v-model="formData.isLocal"
                description="Приватное мероприятие для участников выбранной группы"
                label="Локальное мероприятие"
              />
              <template v-if="formData.isLocal">
                <FormField
                  v-model="formData.groupId"
                  :options="groupOptions"
                  class="full-width"
                  label="Select Group"
                  placeholder="Choose a group (optional)"
                  type="select"
                />
              </template>

              <div class="date-time-grid">
                <FormField
                  v-model="formData.dateTime"
                  label="Date & Time"
                  required
                  type="datetime-local"
                />

                <FormField
                  v-model="formData.maxParticipantsCount"
                  label="Max Participants"
                  min="1"
                  placeholder="Leave empty for unlimited"
                  type="number"
                />

                <FormField
                  v-model="formData.price"
                  label="Price"
                  min="0"
                  placeholder="0 for free event"
                  step="0.01"
                  type="number"
                />
              </div>
            </div>
          </div>

          <!-- Step 4: Preview -->
          <div v-if="activeStep === 3" class="form-step">
            <EventPreviewCard :event="previewData" />
          </div>

          <!-- Navigation Buttons -->
          <div class="form-actions">
            <button v-if="activeStep > 0" class="btn btn-outline" type="button" @click="prevStep">
              Back
            </button>

            <button class="btn btn-primary" type="button" @click="nextStep">
              {{ activeStep === steps.length - 1 ? 'Create Event' : 'Continue' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable no-case-declarations */
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useGroupStore } from '@/shared/stores/groupStore';
import ProgressStepper from '@/shared/components/ProgressStepper.vue';
import FormField from '@/shared/components/form/FormField.vue';
import TagInput from '@/shared/components/TagInput.vue';
import ImageUploader from '@/features/ImageUploader.vue';
import RadioCard from '@/shared/components/form/RadioCard.vue';
import EventPreviewCard from '@/pages/event/create/EventPreviewCard.vue';
import router, { RouteNames } from '@/shared/router';
import LocationPicker from '@/features/LocationPicker.vue';
import FormSwitch from '@/shared/components/form/FormSwitch.vue';

const toast = useToast();
const groupStore = useGroupStore();
const activeStep = ref(0);

const steps = [
  { title: 'Основная информация', icon: 'info' },
  { title: 'Изображение события', icon: 'image' },
  { title: 'Детали', icon: 'settings' },
  { title: 'Предпросмотр', icon: 'preview' }
];

const formData = ref({
  title: '',
  description: '',
  categories: [] as string[],
  dateTime: '',
  isLocal: false,
  groupId: null as string | null,
  maxParticipantsCount: null as number | null,
  price: 0,
  isOnline: false,
  meetingUrl: '',
  imageFile: null as File | null,
  location: null as {
    lat: number;
    lng: number;
    address: string;
  } | null
});

const previewData = computed(() => ({
  ...formData.value,
  imageUrl: formData.value.imageFile ? URL.createObjectURL(formData.value.imageFile) : null
}));

const groupOptions = computed(() => {
  return groupStore.groups.map((group) => ({
    value: group.id,
    label: group.name,
    subLabel: `${group.members.length} members`
  }));
});

onMounted(async () => {
  await groupStore.fetchGroups();
});

const validateStep = (step: number): boolean => {
  switch (step) {
    case 0:
      const basicValid =
        formData.value.title.trim() !== '' &&
        formData.value.description.trim() !== '' &&
        formData.value.categories.length > 0;

      if (formData.value.isLocal && !formData.value.location) {
        toast.error('Please select a location for local event');
        return false;
      }
      return basicValid;
    case 1:
      return formData.value.imageFile !== null;
    case 2:
      const validDateTime = formData.value.dateTime !== '';
      const validParticipants =
        formData.value.maxParticipantsCount === null || formData.value.maxParticipantsCount > 0;
      const validPrice = formData.value.price >= 0;

      return validDateTime && validParticipants && validPrice;
    default:
      return true;
  }
};

const nextStep = () => {
  if (validateStep(activeStep.value)) {
    if (activeStep.value < steps.length - 1) {
      activeStep.value++;
    } else {
      handleSubmit();
    }
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

const handleSubmit = async () => {
  try {
    const formPayload = new FormData();

    // Basic fields
    formPayload.append('title', formData.value.title);
    formPayload.append('description', formData.value.description);
    formPayload.append('categories', JSON.stringify(formData.value.categories));
    formPayload.append('dateTime', new Date(formData.value.dateTime).toISOString());
    formPayload.append('isLocal', formData.value.isLocal.toString());
    formPayload.append('isOnline', formData.value.isOnline.toString());
    formPayload.append('meetingUrl', formData.value.meetingUrl);
    formPayload.append('price', formData.value.price.toString());

    // Conditional fields
    if (formData.value.isLocal && formData.value.groupId) {
      formPayload.append('groupId', formData.value.groupId);
    }
    if (formData.value.maxParticipantsCount) {
      formPayload.append('maxParticipantsCount', formData.value.maxParticipantsCount.toString());
    }
    if (formData.value.location) {
      formPayload.append('location', JSON.stringify(formData.value.location));
    }
    if (formData.value.imageFile) {
      formPayload.append('image', formData.value.imageFile);
    }

    const response = await fetch('http://localhost:2000/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formPayload
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }

    toast.success('Event created successfully!');
    resetForm();
    await router.push({ name: RouteNames.HOME });
  } catch (error) {
    toast.error(`Error creating event: ${(error as Error).message}`);
    console.error('Error details:', error);
  }
};

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    categories: [],
    dateTime: '',
    isLocal: false,
    groupId: null,
    maxParticipantsCount: null,
    location: null,
    price: 0,
    imageFile: null,
    isOnline: false,
    meetingUrl: ''
  };
  activeStep.value = 0;
};
</script>

<style scoped>
.create-event-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
  background-color: var(--color-background-soft);
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-field {
  max-width: 500px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.form-step {
  padding: 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.date-time-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.radio-card-group {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.event-type-selector {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline:hover {
  background: var(--color-background-soft);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
    border-radius: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .date-time-grid {
    grid-template-columns: 1fr;
  }

  .radio-card-group {
    grid-template-columns: 1fr;
  }
}
</style>
