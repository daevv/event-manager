<template>
  <router-link
    :to="{ name: RouteNames.EVENT_DETAILS, params: { id: event.id } }"
    class="event-card"
    neu
  >
    <div class="card-container">
      <div class="image-container">
        <img
          :src="getImgSrc()"
          alt="Event image"
          class="event-image"
          loading="lazy"
          @error="onImageError"
        />
        <div class="date-time">
          <span class="date">{{ formatDate(event.dateTime) }}</span>
          <span class="time">{{ formatTime(event.dateTime) }}</span>
        </div>
      </div>

      <div class="content">
        <div class="title">{{ event.title }}</div>
        <p v-if="!props.isForAdmin" class="description">{{ event.description }}</p>
        <div class="meta">
          <div class="meta-item">
            <img
              class="meta-icon"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/6b2e99629d6890130fe23bbddccb99bf0e7b762907c94ba901f6f501e67f1f47?placeholderIfAbsent=true"
            />
            <span>{{ formatDate(event.dateTime) }}</span>
          </div>
          <div class="meta-item">
            <img
              class="meta-icon"
              src="https://cdn.builder.io/api/v1/image/assets/3d0238404b5a4135b36b371d99801475/0652e1d7fb40fc37b6a2cdc0af2f3f40dda735dfda3afea7ff55ead5950cc291?placeholderIfAbsent=true"
            />
            <span>{{ getPlaceName() }}</span>
          </div>
          <div v-if="!props.isForAdmin" class="meta-item price">
            <span>{{ formatPrice(event.price ?? 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventCard'
});
</script>

<script lang="ts" setup>
import type { EventType } from '@/shared/models/eventsModel';
import { PLACES_DICT } from '@/shared/models/placesModel';
import { RouteNames } from '@/shared/router';
import { API_BASE_URL } from '@/config';

type EventCardProps = {
  event: EventType;
  isForAdmin?: boolean;
};
const props = withDefaults(defineProps<EventCardProps>(), {
  isForAdmin: false
});

function getImgSrc(): string {
  return props.event.imageUrl
    ? `${API_BASE_URL}${props.event.imageUrl}`
    : 'src/assets/images/event_card_1.jpeg';
}

function getPlaceName(): string {
  if (!props.event.location) return props.event.meetingUrl ?? 'Неизвестно';
  const { title } = PLACES_DICT[props.event.location.lat] || { title: 'Неизвестно' };
  return title;
}

function formatDate(dateTime: Date | string): string {
  const date = new Date(dateTime);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}`;
}

function formatTime(dateTime: Date | string): string {
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatPrice(price: number | null): string {
  return price ?? 0 > 0 ? `${price} ₽` : 'Бесплатно';
}

function onImageError(event: Event) {
  (event.target as HTMLImageElement).src = 'src/assets/images/event_card_1.jpeg'; // Замена на дефолтное изображение
}
</script>

<style scoped>
.event-card {
  width: 100%;
  max-width: 400px;
  min-width: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-container {
  display: flex;
  flex-direction: row;
  background: #fff;
}

.image-container {
  position: relative;
  width: 50%;
  height: 500px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 100%);
  color: #fff;
}

.event-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.date-time {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date {
  font-size: 24px;
  font-weight: 700;
}

.time {
  font-size: 18px;
  font-weight: 500;
}

.register-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.register-button:hover {
  background: #1976d2;
}

.content {
  width: 50%;
  padding: 20px;
  background: #f5f5f5;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  height: 30%;
  margin-bottom: 10px;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #666;
}

.meta-icon {
  width: 20px;
  height: 20px;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

@media (max-width: 767px) {
  .event-card {
    max-width: 100%;
  }

  .image-container {
    height: 400px;
  }

  .event-image {
    width: 40%;
  }

  .date {
    font-size: 20px;
  }

  .time {
    font-size: 16px;
  }

  .register-button {
    padding: 8px 16px;
    font-size: 14px;
  }

  .title {
    font-size: 20px;
  }

  .description {
    font-size: 14px;
  }

  .meta-item {
    font-size: 14px;
  }

  .meta-icon {
    width: 18px;
    height: 18px;
  }

  .price {
    font-size: 16px;
  }
}
</style>
