<template>
  <main class="event-page">
    <section v-if="event" class="event-header">
      <div class="event-image-container">
        <img :src="imgSrc" alt="Event image" class="event-image" @error="onImageError" />
        <div class="event-meta">
          <span v-for="category in event.categories" class="event-category">{{ category }}</span>
          <div class="event-location">
            <img
              alt="Location icon"
              class="icon"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6b2e99629d6890130fe23bbddccb99bf0e7b762907c94ba901f6f501e67f1f47?placeholderIfAbsent=true"
            />
            <span>{{ getPlaceName() }}</span>
          </div>
          <div class="event-dates">
            <img
              alt="Calendar icon"
              class="icon"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/0652e1d7fb40fc37b6a2cdc0af2f3f40dda735dfda3afea7ff55ead5950cc291?placeholderIfAbsent=true"
            />
            <span>{{ formatDateTime(event.dateTime) }}</span>
          </div>
          <div class="event-price">
            <span>{{ formatPrice(event.price) }}</span>
          </div>
          <div class="event-actions">
            <button class="buy-ticket-button" @click="handleRegistration">
              {{ registerButtonText }}
            </button>
            <button v-if="canUpdate" class="buy-ticket-button" @click="handleUpdate">
              {{ 'Редактировать' }}
            </button>
            <button class="action-button" @click="handleFavourite">
              <span class="heart-icon">❤️</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="event" class="event-details">
      <div class="event-info">
        <div class="event-tags">
          <span v-for="category in event.categories" class="tag">{{ category }}</span>
          <span class="tag">{{ event.isLocal ? 'Локальное' : 'Онлайн' }}</span>
        </div>
        <h2 class="section-title">Про событие</h2>
        <p class="event-description">{{ event.description }}</p>
      </div>
      <div class="event-contacts">
        <h2 class="section-title">Организатор</h2>
        <div class="organizer-info" @click="handleOrganizerClick">
          <img alt="org-icon" class="user-icon" src="../../assets/images/organizer_icon.jpeg" />
          <div class="organizer-info__content">
            <span class="organizer-name">{{ organizerData.name }}</span>
            <span class="organizer-email">{{ organizerData.email }}</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="event" class="event-comments">
      <CommentList :event-id="eventId" />
    </section>
    <section v-if="event" class="event-participants">
      <ParticipantsList :event-id="eventId" />
    </section>

    <div v-if="eventStore.loading">Загрузка...</div>
    <div v-if="eventStore.error" class="error">{{ eventStore.error }}</div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventPage'
});
</script>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/shared/stores/eventStore';
import { API_BASE_URL } from '@/config';
import { toId } from '@/shared/utilities';
import { type User, useUserStore } from '@/shared/stores/userStore';
import router, { RouteNames } from '@/shared/router';
import CommentList from '@/features/CommentList.vue';
import ParticipantsList from '@/features/ParticipantsList.vue';

// Инициализируем стор и маршрут
const eventStore = useEventStore();
const userStore = useUserStore();
const route = useRoute();

// Получаем ID события из параметров маршрута
const eventId = computed(() => route.params.id as string);
const isUserRegistered = computed<boolean>(() => {
  const userRegisteredEvents = eventStore.registeredEvents.map(toId);
  return userRegisteredEvents.includes(eventId.value);
});

const registerButtonText = computed<string>(() => {
  return isUserRegistered.value ? 'Отменить запись' : 'Записаться на событие';
});

// Получаем событие из стора
const event = computed(() => {
  const foundEvent = eventStore.events.find((e) => e.id === eventId.value);
  if (!foundEvent && !eventStore.loading && !eventStore.error) {
    fetchEvent(); // Если событие не найдено, загружаем его
  }
  return foundEvent || null;
});

const organizer = ref<User | null>(null);
const organizerData = computed(() => ({
  name: organizer.value?.firstName + ' ' + organizer.value?.secondName,
  email: organizer.value?.email ?? 'testMail@mail.ru'
}));

const canUpdate = computed<boolean>(() => userStore.user?.id === event.value?.organizerId);

// Получаем URL изображения
const imgSrc = computed(() =>
  event.value?.imageUrl
    ? `${API_BASE_URL}${event.value.imageUrl}`
    : '/src/assets/images/default.jpeg'
);

// Функции форматирования
function formatDateTime(dateTime: Date | string): string {
  const date = new Date(dateTime);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function formatPrice(price: number | null): string {
  return price !== null && price > 0 ? `${price} ₽` : 'Бесплатно';
}

function getPlaceName(): string {
  if (!event.value?.location) return 'Online or TBD';
  return event.value?.location.address || 'Unknown Place';
}

function onImageError(event: Event) {
  (event.target as HTMLImageElement).src = '/src/assets/images/event_card_1.jpeg';
}

// Загрузка данных
const fetchEvent = async () => {
  await eventStore.fetchEventById(eventId.value);
  // if (Object.keys(eventStore.placesDict).length === 0) {
  //   await eventStore.fetchPlaces();
  // }
};

async function handleRegistration(): Promise<void> {
  isUserRegistered.value
    ? await eventStore.unregister(eventId.value, userStore.user?.email ?? '')
    : await eventStore.register(eventId.value, userStore.user?.email ?? '');
}

async function handleUpdate(): Promise<void> {
  await router.push({ name: RouteNames.EVENT_EDIT, params: { id: eventId.value } });
}

async function handleFavourite(): Promise<void> {
  eventStore.toggleFavourite(eventId.value);
}

async function handleOrganizerClick() {
  await router.push({ name: RouteNames.ORGANIZER_PAGE, params: { id: organizer.value?.id } });
}

onMounted(async () => {
  await fetchEvent();
  organizer.value = await userStore.fetchUser(event.value?.organizerId);
});
</script>

<style scoped>
.event-page {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  min-height: 100vh;
}

.event-header {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3));
  padding: 40px 0;
}

.event-image-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
}

.event-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  filter: brightness(0.7);
}

.event-meta {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
}

.event-category {
  font-size: 18px;
  font-weight: 600;
  color: #ff6f61;
  text-transform: uppercase;
}

.event-location,
.event-dates,
.event-price {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.icon {
  width: 20px;
  height: 20px;
}

.event-price {
  font-size: 18px;
  font-weight: 700;
}

.buy-ticket-button {
  padding: 12px 24px;
  background: #ff6f61;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.buy-ticket-button:hover {
  background: #e65a50;
}

.event-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.event-details {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;
}

.event-info {
  flex: 2;
}

.event-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  padding: 6px 12px;
  background: #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 20px 0;
}

.event-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.organizer-info {
  display: flex;
  gap: 2rem;
  padding: 12px;
  border-radius: 24px;
  border: 1px solid #ff6f61;
  transition: background-color 0.2s linear;

  .user-icon {
    border-radius: 50%;
    height: 55px;
    width: 55px;
  }

  .organizer-info__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &:hover {
    background: rgba(255, 111, 97, 0.1);
  }
}

/* Стили остаются без изменений */
.error {
  color: red;
  text-align: center;
  padding: 20px;
}

@media (max-width: 767px) {
  .event-header {
    padding: 20px 0;
  }

  .event-image {
    height: 300px;
  }

  .event-meta {
    bottom: 10px;
    left: 10px;
    gap: 8px;
  }

  .event-category {
    font-size: 16px;
  }

  .event-location,
  .event-dates,
  .event-price {
    font-size: 14px;
  }

  .buy-ticket-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .action-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .event-details {
    flex-direction: column;
    gap: 20px;
    margin: 20px auto;
  }

  .section-title {
    font-size: 20px;
  }

  .event-description {
    font-size: 14px;
  }
}
</style>
