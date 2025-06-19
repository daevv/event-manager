<template>
  <div class="events-calendar-page">
    <h1 class="page-title">Мои мероприятия</h1>

    <div class="calendar-controls">
      <button class="nav-button" @click="prevPeriod">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <h2 class="current-period">{{ periodTitle }}</h2>

      <button class="nav-button" @click="nextPeriod">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div class="view-toggle">
        <button
          :class="{ active: view === 'month' }"
          class="toggle-button"
          @click="setView('month')"
        >
          Месяц
        </button>
        <button :class="{ active: view === 'week' }" class="toggle-button" @click="setView('week')">
          Неделя
        </button>
      </div>
    </div>

    <div class="calendar-container">
      <!-- Month view -->
      <div v-if="view === 'month'" class="month-view">
        <div class="weekdays-header">
          <div v-for="day in weekdays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <div class="month-grid">
          <div
            v-for="day in monthDays"
            :key="day.date.toString()"
            :class="{
              'day-cell': true,
              'current-month': day.isCurrentMonth,
              today: day.isToday,
              'has-events': day.events.length > 0
            }"
            @click="selectDate(day.date)"
          >
            <div class="day-number">{{ day.date.getDate() }}</div>
            <div class="day-events">
              <div
                v-for="event in day.events"
                :key="event.id"
                class="event-preview"
                @click.stop="goToEvent(event.id)"
              >
                <div class="event-time">
                  {{ formatTime(event.dateTime) }}
                </div>
                <div class="event-title">
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week view -->
      <div v-if="view === 'week'" class="week-view">
        <div class="week-header">
          <div class="time-column"></div>
          <div
            v-for="day in weekDays"
            :key="day.date.toString()"
            :class="{
              'day-header': true,
              today: day.isToday
            }"
          >
            <div class="weekday-name">{{ formatWeekday(day.date) }}</div>
            <div class="day-number">{{ day.date.getDate() }}</div>
          </div>
        </div>

        <div class="week-grid">
          <div class="time-column">
            <div v-for="hour in hours" :key="hour" class="hour-slot">{{ hour }}:00</div>
          </div>

          <div v-for="day in weekDays" :key="day.date.toString()" class="day-column">
            <div
              v-for="hour in hours"
              :key="hour"
              :data-date="formatHourDate(day.date, hour)"
              class="hour-slot"
            >
              <div
                v-for="event in getEventsForHour(day.date, hour)"
                :key="event.id"
                :style="{ height: calculateEventHeight() }"
                class="week-event"
                @click.stop="goToEvent(event.id)"
              >
                <div class="event-time">
                  {{ formatTime(event.dateTime) }}
                </div>
                <div class="event-title">
                  {{ event.title }}
                </div>
                <div class="event-place">
                  {{ getPlaceName(event) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyEventsCalendar'
});
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from '@/shared/stores/eventStore';
import type { EventType } from '@/shared/models/eventsModel';

const eventStore = useEventStore();
const router = useRouter();

const currentDate = ref(new Date());
const view = ref<'month' | 'week'>('month');

// Получаем мероприятия пользователя
const registeredEvents = computed(() => eventStore.registeredEvents);

// Форматирование времени
const formatTime = (dateTime: Date | string) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Получаем название места
const getPlaceName = (event: EventType) => {
  if (!event.location) return 'Online';
  return 'Unknown';
};

// Навигация по периодам
const prevPeriod = () => {
  if (view.value === 'month') {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
  } else {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      currentDate.value.getDate() - 7
    );
  }
};

const nextPeriod = () => {
  if (view.value === 'month') {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    );
  } else {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      currentDate.value.getDate() + 7
    );
  }
};

// Заголовок периода
const periodTitle = computed(() => {
  if (view.value === 'month') {
    return currentDate.value.toLocaleDateString('ru', {
      month: 'long',
      year: 'numeric'
    });
  } else {
    const startOfWeek = new Date(currentDate.value);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return `${startOfWeek.getDate()} ${startOfWeek.toLocaleDateString('ru', {
      month: 'short'
    })} -
                ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString('ru', {
      month: 'short'
    })}`;
  }
});

// Дни недели для заголовков
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Часы для недельного вида
const hours = Array.from({ length: 24 }, (_, i) => i);

// Форматирование даты часа
const formatHourDate = (date: Date, hour: number) => {
  const newDate = new Date(date);
  newDate.setHours(hour, 0, 0, 0);
  return newDate.toISOString();
};

// Получаем дни месяца для отображения
const monthDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  // Первый день месяца
  const firstDay = new Date(year, month, 1);
  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0);

  // День недели первого дня месяца (0 - воскресенье, 1 - понедельник и т.д.)
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Преобразуем к формату Пн-0, Вт-1 и т.д.

  // День недели последнего дня месяца
  const lastDayOfWeek = (lastDay.getDay() + 6) % 7;

  // Начало календаря (дни предыдущего месяца)
  const startDate = new Date(firstDay);
  startDate.setDate(-firstDayOfWeek + 1);

  // Конец календаря (дни следующего месяца)
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDayOfWeek));

  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);

    const isCurrentMonth = date.getMonth() === month;
    const isToday = date.getTime() === today.getTime();

    // Фильтруем мероприятия для этого дня
    const events = registeredEvents.value.filter((event) => {
      const eventDate = new Date(event.dateTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === date.getTime();
    });

    days.push({
      date: new Date(date),
      isCurrentMonth,
      isToday,
      events
    });
  }

  return days;
});

// Получаем дни недели для недельного вида
const weekDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Находим понедельник текущей недели
  const startDate = new Date(currentDate.value);
  startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const isToday = date.getTime() === today.getTime();

    days.push({
      date: new Date(date),
      isToday
    });
  }

  return days;
});

// Получаем мероприятия для определенного часа
const getEventsForHour = (date: Date, hour: number) => {
  const start = new Date(date);
  start.setHours(hour, 0, 0, 0);

  const end = new Date(date);
  end.setHours(hour + 1, 0, 0, 0);

  return registeredEvents.value.filter((event) => {
    const eventDate = new Date(event.dateTime);
    return eventDate >= start && eventDate < end;
  });
};

// Вычисляем высоту события в недельном виде
const calculateEventHeight = () => {
  const duration = 60; // По умолчанию 60 минут
  return `${(duration / 60) * 40}px`; // 40px на час
};

// Форматирование дня недели
const formatWeekday = (date: Date) => {
  return date.toLocaleDateString('default', { weekday: 'short' });
};

// Переход к событию
const goToEvent = (id: string) => {
  router.push({ name: 'EventDetails', params: { id } });
};

// Выбор даты
const selectDate = (date: Date) => {
  currentDate.value = date;
  if (view.value === 'month') {
    view.value = 'week';
  }
};

// Установка вида
const setView = (newView: 'month' | 'week') => {
  view.value = newView;
};
</script>

<style scoped>
.events-calendar-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.current-period {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 1rem;
  color: #2c3e50;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c3e50;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #f0f0f0;
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.toggle-button:hover {
  background-color: #f5f5f5;
}

.toggle-button.active {
  background-color: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.calendar-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Month view styles */
.month-view {
  display: flex;
  flex-direction: column;
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.weekday {
  padding: 0.75rem;
  text-align: center;
  font-weight: 500;
  color: #666;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  min-height: 600px;
}

.day-cell {
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  position: relative;
  min-height: 100px;
  transition: background-color 0.2s;
}

.day-cell:hover {
  background-color: #f9f9f9;
}

.day-cell.current-month {
  background-color: white;
}

.day-cell:not(.current-month) {
  background-color: #fafafa;
  color: #aaa;
}

.day-cell.today {
  background-color: #e8f4fe;
}

.day-cell.today .day-number {
  font-weight: bold;
  color: #1a73e8;
}

.day-number {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.day-events {
  overflow-y: auto;
  max-height: calc(100% - 1.5rem);
}

.event-preview {
  background-color: #e8f4fe;
  border-left: 3px solid #1a73e8;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.event-preview:hover {
  background-color: #d0e3fa;
}

.event-time {
  font-size: 0.7rem;
  color: #1a73e8;
  font-weight: 500;
}

.event-title {
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Week view styles */
.week-view {
  display: flex;
  flex-direction: column;
}

.week-header {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.day-header {
  padding: 0.75rem;
  text-align: center;
}

.day-header.today {
  background-color: #e8f4fe;
}

.day-header.today .day-number {
  font-weight: bold;
  color: #1a73e8;
}

.weekday-name {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.day-number {
  font-size: 1.2rem;
  font-weight: 500;
}

.week-grid {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  height: calc(24 * 40px);
  overflow-y: auto;
}

.time-column {
  grid-column: 1;
}

.hour-slot {
  height: 40px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  font-size: 0.7rem;
  padding: 0.25rem;
  color: #999;
}

.day-column {
  display: contents;
}

.day-column .hour-slot {
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.week-event {
  position: absolute;
  width: calc(100% - 8px);
  margin: 0 4px;
  background-color: #e8f4fe;
  border-left: 3px solid #1a73e8;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.week-event:hover {
  background-color: #d0e3fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.week-event .event-time {
  font-size: 0.7rem;
  color: #1a73e8;
  font-weight: 500;
}

.week-event .event-title {
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.week-event .event-place {
  font-size: 0.7rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calendar-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .view-toggle {
    align-self: flex-end;
  }

  .month-grid {
    min-height: 400px;
  }

  .day-cell {
    min-height: 60px;
  }

  .event-preview {
    display: none;
  }

  .day-cell.has-events::after {
    content: '•';
    color: #1a73e8;
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    font-size: 1.2rem;
  }
}
</style>
