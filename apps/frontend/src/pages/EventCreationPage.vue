<template>
  <div class="container">
    <EventHeader />

    <main class="main-content">
      <ProgressBar :activeStep="activeStep" :steps="progressSteps" />

      <form class="event-form" @submit.prevent="handleSubmit">
        <!-- Tab 1: Общая информация -->
        <FormSection v-if="activeStep === 0" title="Event Details">
          <FormGroup id="eventTitle" label="Event Title" required>
            <FormField
              v-model="formData.title"
              placeholder="Enter the name of your event"
              type="text"
            />
          </FormGroup>

          <FormGroup id="eventDescription" label="Event Description" required>
            <FormField
              v-model="formData.description"
              placeholder="Describe your event"
              type="textarea"
            />
          </FormGroup>

          <FormGroup id="eventCategory" label="Category" required>
            <FormField v-model="formData.category" placeholder="Enter event category" type="text" />
          </FormGroup>

          <FormGroup id="eventPlaceId" label="Place ID (optional)">
            <FormField v-model="formData.placeId" placeholder="Enter place ID" type="text" />
          </FormGroup>
        </FormSection>

        <!-- Tab 2: Загрузка изображения -->
        <FormSection v-if="activeStep === 1" title="Upload Event Image">
          <FormGroup id="eventImage" label="Event Image" required>
            <input class="input-file" type="file" @change="handleImageUpload" />
            <img
              v-if="formData.imageUrl"
              :src="formData.imageUrl"
              alt="Event Preview"
              class="image-preview"
            />
          </FormGroup>
        </FormSection>

        <!-- Tab 3: Тип мероприятия -->
        <FormSection v-if="activeStep === 2" title="Event Type & Tickets">
          <FormGroup id="eventType" label="Event Type" required>
            <div class="radio-group">
              <label class="radio-item">
                <input v-model="formData.isLocal" :value="true" name="eventType" type="radio" />
                Local
              </label>
              <label class="radio-item">
                <input v-model="formData.isLocal" :value="false" name="eventType" type="radio" />
                Online
              </label>
            </div>
          </FormGroup>

          <FormGroup v-if="formData.isLocal" id="groupId" label="Group ID (for local events)">
            <FormField v-model="formData.groupId" placeholder="Enter group ID" type="text" />
          </FormGroup>

          <FormGroup id="maxParticipantsCount" label="Max Participants" required>
            <FormField
              v-model="formData.maxParticipantsCount"
              min="1"
              placeholder="Enter max participants"
              type="number"
            />
          </FormGroup>

          <FormGroup id="price" label="Price" required>
            <FormField
              v-model="formData.price"
              min="0"
              placeholder="Enter price (0 for free)"
              step="0.01"
              type="number"
            />
          </FormGroup>

          <FormGroup id="dateTime" label="Event Date & Time" required>
            <FormField v-model="formData.dateTime" type="datetime-local" />
          </FormGroup>
        </FormSection>

        <!-- Tab 4: Предпросмотр -->
        <FormSection v-if="activeStep === 3" title="Event Preview">
          <div class="preview-card">
            <h2 class="preview-title">{{ formData.title }}</h2>
            <img
              v-if="formData.imageUrl"
              :src="formData.imageUrl"
              alt="Event Preview"
              class="preview-image"
            />
            <p class="preview-text"><strong>Description:</strong> {{ formData.description }}</p>
            <p class="preview-text"><strong>Category:</strong> {{ formData.category }}</p>
            <p class="preview-text"><strong>Place ID:</strong> {{ formData.placeId || 'N/A' }}</p>
            <p class="preview-text">
              <strong>Type:</strong> {{ formData.isLocal ? 'Local' : 'Online' }}
            </p>
            <p v-if="formData.isLocal" class="preview-text">
              <strong>Group ID:</strong> {{ formData.groupId || 'N/A' }}
            </p>
            <p class="preview-text">
              <strong>Max Participants:</strong> {{ formData.maxParticipantsCount }}
            </p>
            <p class="preview-text"><strong>Price:</strong> ${{ formData.price }}</p>
            <p class="preview-text"><strong>Date & Time:</strong> {{ formData.dateTime }}</p>
          </div>
        </FormSection>

        <!-- Кнопки управления -->
        <div class="button-group">
          <button :disabled="activeStep === 0" class="button-back" type="button" @click="prevStep">
            Back
          </button>
          <button class="button-next" type="button" @click="nextStep">
            {{ activeStep === 3 ? 'Submit' : 'Next' }}
          </button>
        </div>
      </form>
    </main>

    <FooterSection />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import EventHeader from '@/widgets/EventHeader.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import FormSection from '@/components/form/FormSection.vue';
import FormGroup from '@/components/form/FormGroup.vue';
import FooterSection from '@/widgets/FooterSection.vue';
import FormField from '@/components/form/FormField.vue';
import router, { RouteNames } from '@/router';

const toast = useToast();
const activeStep = ref(0);

const progressSteps = [
  { title: 'Details', isCompleted: false },
  { title: 'Image', isCompleted: false },
  { title: 'Tickets', isCompleted: false },
  { title: 'Preview', isCompleted: false }
];

const formData = ref({
  title: '',
  description: '',
  category: '',
  dateTime: '',
  isLocal: false,
  groupId: '' as string | null,
  maxParticipantsCount: 0,
  price: 0,
  placeId: '' as string | null,
  isFree: false,
  image: null as File | null,
  imageUrl: ''
});

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    category: '',
    dateTime: '',
    isLocal: false,
    groupId: null,
    maxParticipantsCount: 0,
    price: 0,
    placeId: null,
    isFree: false,
    image: null,
    imageUrl: ''
  };
  activeStep.value = 0;
  progressSteps.forEach((step) => (step.isCompleted = false));
};

const nextStep = () => {
  if (validateStep(activeStep.value)) {
    progressSteps[activeStep.value].isCompleted = true;
    if (activeStep.value < 3) {
      activeStep.value++;
    } else {
      handleSubmit();
    }
  } else {
    toast.error('Please fill in all required fields.');
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

const validateStep = (step: number) => {
  if (step === 0)
    return formData.value.title && formData.value.description && formData.value.category;
  if (step === 1) return formData.value.imageUrl;
  if (step === 2) {
    return (
      (formData.value.isLocal ? formData.value.groupId : true) &&
      formData.value.maxParticipantsCount > 0 &&
      formData.value.price >= 0 &&
      formData.value.dateTime
    );
  }
  return true;
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.image = file;
    formData.value.imageUrl = URL.createObjectURL(file); // Локальный предпросмотр
  }
};

// Ваша Vue-компонента
const handleSubmit = async () => {
  const formDataPayload = new FormData();
  formDataPayload.append('title', formData.value.title);
  formDataPayload.append('description', formData.value.description);
  formDataPayload.append('category', formData.value.category);
  formDataPayload.append('dateTime', new Date(formData.value.dateTime).toISOString());
  formDataPayload.append('isLocal', formData.value.isLocal.toString());
  if (formData.value.isLocal && formData.value.groupId) {
    formDataPayload.append('groupId', formData.value.groupId);
  }
  formDataPayload.append('maxParticipantsCount', formData.value.maxParticipantsCount.toString());
  formDataPayload.append('price', formData.value.price.toString());
  if (formData.value.placeId) {
    formDataPayload.append('placeId', formData.value.placeId);
  }
  formDataPayload.append('isFree', (formData.value.price === 0).toString());
  if (formData.value.image) {
    formDataPayload.append('image', formData.value.image); // Добавляем файл изображения
  }

  try {
    // TODO добавь axios
    // мб проблема с content-type
    const response = await fetch('http://localhost:2000/events', {
      method: 'POST',
      headers: {
        // Не устанавливаем Content-Type вручную, так как FormData сам это сделает
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formDataPayload
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
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.main-content {
  padding: 40px 80px;
}

.event-form {
  margin-top: 50px;
}

.input-select,
.input-file {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  font-size: 18px;
}

.image-preview,
.preview-image {
  margin-top: 15px;
  border-radius: 10px;
  max-height: 300px;
  width: auto;
}

.preview-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button-back,
.button-next {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
}

.button-back {
  background-color: #6b7280;
}

.button-next {
  background-color: #facc15;
}

.button-next:hover {
  background-color: #eab308;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
