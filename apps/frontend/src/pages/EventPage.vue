<template>
  <main class="event-page">
    <EventHeader />
    <section v-if="event" class="event-header">
      <div class="event-image-container">
        <img :src="imgSrc" alt="Event image" class="event-image" @error="onImageError" />
        <div class="event-meta">
          <span class="event-category">{{ event.category }}</span>
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
          <button class="buy-ticket-button">Купить билет</button>
          <div class="event-actions">
            <button class="action-button">
              <span class="heart-icon">❤️</span> {{ event.participantsCount }}
            </button>
            <button class="action-button">
              <span class="share-icon">↪️</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="event" class="event-details">
      <div class="event-info">
        <div class="event-tags">
          <span class="tag">Возраст 18+</span>
          <span class="tag">{{ event.category }}</span>
          <span class="tag">{{ event.isLocal ? 'Локальное' : 'Онлайн' }}</span>
        </div>
        <h2 class="section-title">Про событие</h2>
        <p class="event-description">{{ event.description }}</p>
      </div>
      <div class="event-contacts">
        <h2 class="section-title">Контакты</h2>
        <p class="contact-info">Телефон: <a href="tel:+79991234567">+7 (999) 123-45-67</a></p>
      </div>
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
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores/eventStore';
import EventHeader from '@/widgets/EventHeader.vue';
import { API_BASE_URL } from '@/config';

// Инициализируем стор и маршрут
const eventStore = useEventStore();
const route = useRoute();

// Получаем ID события из параметров маршрута
const eventId = computed(() => route.params.id as string);

// Получаем событие из стора
const event = computed(() => {
  const foundEvent = eventStore.events.find((e) => e.id === eventId.value);
  if (!foundEvent && !eventStore.loading && !eventStore.error) {
    fetchEvent(); // Если событие не найдено, загружаем его
  }
  return foundEvent || null;
});

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
  return price !== null ? `${price} ₽` : 'Бесплатно';
}

function getPlaceName(): string {
  if (!event.value?.placeId) return 'Online or TBD';
  return eventStore.placesDict[event.value.placeId]?.title || 'Unknown Place';
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

onMounted(() => {
  fetchEvent();
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
  position: absolute;
  bottom: 20px;
  right: 20px;
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

.event-contacts {
  flex: 1;
}

.contact-info {
  font-size: 16px;
  color: #666;
}

.contact-info a {
  color: #ff6f61;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
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

  .event-actions {
    bottom: 10px;
    right: 10px;
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

  .event-description,
  .contact-info {
    font-size: 14px;
  }
}
</style>
