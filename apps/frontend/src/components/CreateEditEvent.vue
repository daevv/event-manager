<template>
  <div class="event-container">
    <h1 class="page-title">Управление мероприятиями</h1>

    <!-- Форма создания мероприятия -->
    <div v-if="mode === 'create'" class="event-form">
      <h2>Создание мероприятия</h2>
      <input v-model="eventForm.name" class="form-input" placeholder="Название (5–40 символов)" />
      <select v-model="eventForm.category" class="form-input">
        <option disabled value="">Выберите категорию</option>
        <option value="sport">Спорт</option>
        <option value="education">Образование</option>
        <option value="culture">Культура</option>
      </select>
      <input v-model="eventForm.date" class="form-input" type="datetime-local" />
      <input v-model="eventForm.location" class="form-input" placeholder="Место проведения" />
      <textarea
        v-model="eventForm.description"
        class="form-input"
        placeholder="Описание (15–300 символов)"
      ></textarea>
      <input
        v-model="eventForm.maxParticipants"
        class="form-input"
        placeholder="Максимальное количество участников"
        type="number"
      />
      <select v-model="eventForm.type" class="form-input">
        <option value="local">Локальное</option>
        <option value="global">Глобальное</option>
      </select>
      <input v-model="eventForm.cost" class="form-input" placeholder="Стоимость" type="number" />
      <button class="form-button" @click="createEvent">Создать</button>
      <button class="form-button secondary" @click="mode = 'view'">Отмена</button>
    </div>

    <!-- Список мероприятий -->
    <div v-else class="event-list">
      <div v-for="event in events" :key="event.id ?? 0" class="event-card">
        <h3>{{ event.name }}</h3>
        <p>{{ event.description }}</p>
        <p><strong>Категория:</strong> {{ event.category }}</p>
        <p><strong>Дата:</strong> {{ formatDate(event.date) }}</p>
        <p><strong>Место:</strong> {{ event.location }}</p>
        <p><strong>Тип:</strong> {{ event.type === 'local' ? 'Локальное' : 'Глобальное' }}</p>
        <button class="form-button" @click="editEvent(event)">Редактировать</button>
        <button class="form-button secondary" @click="deleteEvent(event.id)">Удалить</button>
      </div>
      <button class="form-button" @click="mode = 'create'">Создать новое мероприятие</button>
    </div>

    <!-- Форма редактирования мероприятия -->
    <div v-if="mode === 'edit'" class="event-form">
      <h2>Редактирование мероприятия</h2>
      <input v-model="eventForm.name" class="form-input" placeholder="Название (5–40 символов)" />
      <select v-model="eventForm.category" class="form-input">
        <option disabled value="">Выберите категорию</option>
        <option value="sport">Спорт</option>
        <option value="education">Образование</option>
        <option value="culture">Культура</option>
      </select>
      <input v-model="eventForm.date" class="form-input" type="datetime-local" />
      <input v-model="eventForm.location" class="form-input" placeholder="Место проведения" />
      <textarea
        v-model="eventForm.description"
        class="form-input"
        placeholder="Описание (15–300 символов)"
      ></textarea>
      <input
        v-model="eventForm.maxParticipants"
        class="form-input"
        placeholder="Максимальное количество участников"
        type="number"
      />
      <input v-model="eventForm.cost" class="form-input" placeholder="Стоимость" type="number" />
      <button class="form-button" @click="updateEvent">Сохранить</button>
      <button class="form-button secondary" @click="mode = 'view'">Отмена</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type Event = {
  id: number;
  name: string;
  category: string;
  date: string;
  location: string;
  description: string;
  maxParticipants: null;
  type: 'local' | 'global';
  cost: number;
};

const mode = ref('view'); // Режимы: 'create', 'edit', 'view'
const events = ref<Event[]>([]); // Список мероприятий
const eventForm = ref<Event>({
  id: 0,
  name: '',
  category: '',
  date: '',
  location: '',
  description: '',
  maxParticipants: null,
  type: 'local',
  cost: 0
});

// Валидация названия
const validateName = (name: string) => name.length >= 5 && name.length <= 40;

// Валидация описания
const validateDescription = (description: string) =>
  description.length >= 15 && description.length <= 300;

// Валидация даты
const validateDate = (date: string) => new Date(date) > new Date(Date.now() + 24 * 60 * 60 * 1000);

// Форматирование даты
const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

// Создание мероприятия
const createEvent = () => {
  if (!validateName(eventForm.value.name)) {
    alert('Название должно содержать от 5 до 40 символов');
    return;
  }
  if (!validateDescription(eventForm.value.description)) {
    alert('Описание должно содержать от 15 до 300 символов');
    return;
  }
  if (!validateDate(eventForm.value.date)) {
    alert('Дата должна быть минимум на 24 часа позже текущего времени');
    return;
  }

  const newEvent = { ...eventForm.value, id: Date.now() } as Event;
  events.value.push(newEvent);
  mode.value = 'view';
  alert('Мероприятие создано!');
};

// Редактирование мероприятия
const editEvent = (event: Event) => {
  eventForm.value = { ...event };
  mode.value = 'edit';
};

// Обновление мероприятия
const updateEvent = () => {
  const index = events.value.findIndex((e) => e.id === eventForm.value.id);
  if (index !== -1) {
    events.value[index] = { ...eventForm.value };
    mode.value = 'view';
    alert('Мероприятие обновлено! Участники уведомлены.');
  }
};

// Удаление мероприятия
const deleteEvent = (id: number) => {
  events.value = events.value.filter((e) => e.id !== id);
  alert('Мероприятие удалено! Участники уведомлены.');
};
</script>

<style scoped>
.event-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.event-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-card {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
}

.form-button.secondary {
  background-color: #6c757d;
}

@media (max-width: 600px) {
  .event-container {
    padding: 10px;
  }

  .form-input {
    font-size: 0.9rem;
  }

  .form-button {
    font-size: 0.9rem;
    padding: 8px;
  }
}
</style>
