<template>
  <div class="edit-event-page">
    <div class="container">
      <div class="header">
        <h1 class="title">Редактирование мероприятия</h1>
        <router-link :to="`/event/${eventId}`" class="back-link"> ← Назад к событию </router-link>
      </div>

      <div v-if="loading" class="loading-spinner">
        {{ 'Loading' }}
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button class="retry-button" @click="fetchEvent">Попробовать снова</button>
      </div>

      <form v-else class="edit-form" @submit.prevent="handleSubmit">
        <!-- Основная информация -->
        <section class="form-section">
          <h2 class="section-title">Основная информация</h2>

          <div class="form-grid">
            <FormField
              v-model="formData.title"
              class="full-width"
              label="Название"
              placeholder="Введите название"
              required
            />

            <FormField
              v-model="formData.description"
              class="full-width"
              label="Описание"
              placeholder="Расскажите о вашем мероприятии"
              required
              type="textarea"
            />

            <ImageUploader
              v-model="formData.imageFile"
              :initial-image="formData?.imageFile"
              class="full-width"
              label="Обложка мероприятия"
            />

            <TagInput
              v-model="formData.categories"
              class="full-width"
              label="Категории"
              placeholder="Добавьте категории"
            />
          </div>
        </section>

        <!-- Дата и время -->
        <section class="form-section">
          <h2 class="section-title">Дата и время</h2>

          <div class="form-grid">
            <FormField
              v-model="formData.dateTime"
              label="Дата и время начала"
              required
              type="datetime-local"
            />

            <FormField
              v-model="formData.endDateTime"
              label="Дата и время окончания"
              type="datetime-local"
            />
          </div>
        </section>

        <!-- Местоположение -->
        <section class="form-section">
          <h2 class="section-title">Местоположение</h2>

          <div class="form-grid">
            <RadioGroup
              v-model="formData.eventType"
              :options="eventTypeOptions"
              class="full-width"
            />

            <LocationPicker
              v-if="formData.eventType !== 'online'"
              v-model="formData.location"
              :initial-location="formData?.location"
              class="full-width"
            />
          </div>
        </section>

        <!-- Детали мероприятия -->
        <section class="form-section">
          <h2 class="section-title">Детали мероприятия</h2>

          <div class="form-grid">
            <FormField
              v-model="formData.price"
              label="Цена"
              min="0"
              step="0.01"
              type="number"
              @input="formData.isFree = formData.price === 0"
            />

            <FormField
              v-model="formData.maxParticipants"
              label="Макс. участников"
              min="1"
              placeholder="Не ограничено"
              type="number"
            />

            <FormField
              v-model="formData.groupId"
              :options="groupOptions"
              class="full-width"
              label="Группа (для локальных мероприятий)"
              type="select"
            />
          </div>
        </section>

        <!-- Кнопки действий -->
        <div class="form-actions">
          <button class="btn btn-outline" type="button" @click="handleCancel">Отменить</button>

          <button :disabled="isSubmitting" class="btn btn-primary" type="submit">
            <span v-if="isSubmitting">Сохранение...</span>
            <span v-else>Сохранить изменения</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEventStore } from '@/shared/stores/eventStore';
import { useGroupStore } from '@/shared/stores/groupStore';
import FormField from '@/shared/components/form/FormField.vue';
import ImageUploader from '@/features/ImageUploader.vue';
import TagInput from '@/shared/components/TagInput.vue';
import LocationPicker from '@/features/LocationPicker.vue';
import { RadioGroup } from '@headlessui/vue';
import type { EventType } from '@/shared/models/eventsModel';
import { RouteNames } from '@/shared/router';

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();
const groupStore = useGroupStore();

const eventId = computed(() => route.params.id as string);

// Состояния
const loading = ref(true);
const error = ref<string | null>(null);
const isSubmitting = ref(false);

// Форма
const formData = ref({
  title: '',
  description: '',
  categories: [] as string[],
  dateTime: '',
  endDateTime: '',
  eventType: 'online' as 'online' | 'public' | 'local',
  location: null as { lat: number; lng: number; address: string } | null,
  price: 0,
  isFree: false,
  maxParticipants: null as number | null,
  groupId: null as string | null,
  imageFile: null as File | null
});

// Опции для типов мероприятий
const eventTypeOptions = [
  { value: 'online', label: 'Онлайн', icon: 'video' },
  { value: 'public', label: 'Публичное оффлайн', icon: 'location' },
  { value: 'local', label: 'Локальное (для группы)', icon: 'group' }
];

// Опции групп
const groupOptions = computed(() => {
  return groupStore.groups.map((group) => ({
    value: group.id,
    label: group.name
  }));
});

// Загрузка данных
const fetchEvent = async () => {
  try {
    loading.value = true;
    error.value = null;
    const currentEvent = await eventStore.fetchEventById(eventId.value);
    currentEvent && fillFormWithEventData(currentEvent);
  } catch (err) {
    error.value = 'Не удалось загрузить данные мероприятия';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Заполнение формы данными из стора
const fillFormWithEventData = (event: EventType) => {
  formData.value = {
    title: event.title,
    description: event.description,
    categories: [...event.categories],
    dateTime: formatDateTimeForInput(event.dateTime),
    endDateTime: event.endDateTime ? formatDateTimeForInput(event.endDateTime) : '',
    eventType: event.isLocal ? 'local' : event.location ? 'public' : 'online',
    location: event.location,
    price: event.price || 0,
    isFree: event.isFree,
    maxParticipants: event.maxParticipantsCount,
    groupId: event.groupId || null,
    imageFile: null
  };
};

// Форматирование даты для input[type="datetime-local"]
const formatDateTimeForInput = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

// Отправка формы
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    const formPayload = new FormData();
    formPayload.append('title', formData.value.title);
    formPayload.append('description', formData.value.description);
    formPayload.append('categories', JSON.stringify(formData.value.categories));
    formPayload.append('dateTime', new Date(formData.value.dateTime).toISOString());

    if (formData.value.endDateTime) {
      formPayload.append('endDateTime', new Date(formData.value.endDateTime).toISOString());
    }

    formPayload.append('isLocal', (formData.value.eventType === 'local').toString());
    formPayload.append('price', formData.value.price.toString());
    formPayload.append('isFree', formData.value.isFree.toString());

    if (formData.value.maxParticipants) {
      formPayload.append('maxParticipants', formData.value.maxParticipants.toString());
    }

    if (formData.value.location) {
      formPayload.append('location', JSON.stringify(formData.value.location));
    }

    if (formData.value.groupId) {
      formPayload.append('groupId', formData.value.groupId);
    }

    if (formData.value.imageFile) {
      formPayload.append('image', formData.value.imageFile);
    }

    await eventStore.updateEvent(eventId.value, formPayload);
    await router.push({ name: RouteNames.HOME });
  } catch (err) {
    error.value = 'Ошибка при сохранении изменений';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

// Отмена редактирования
const handleCancel = () => {
  router.push({ name: RouteNames.HOME });
};

// Инициализация
onMounted(async () => {
  await Promise.all([fetchEvent(), groupStore.fetchGroups()]);
});
</script>

<style scoped>
.edit-event-page {
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.back-link {
  display: inline-block;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 2rem;
}

.back-link:hover {
  text-decoration: underline;
}

.edit-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.full-width {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
}

.btn-outline:hover {
  background: var(--color-background);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.error-message {
  text-align: center;
  color: var(--color-danger);
  padding: 2rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
