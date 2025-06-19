<template>
  <div class="event-card favorites">
    <router-link
      :to="{ name: RouteNames.EVENT_DETAILS, params: { id: event.id } }"
      class="card-link"
    >
      <div class="card-container" :style="{ backgroundImage: `url(${getImgSrc()})` }">
        <div class="overlay">
          <div class="date-time">
            <span class="date">{{ formatDate(event.dateTime) }}</span>
            <span class="time">{{ formatTime(event.dateTime) }}</span>
          </div>
          <div class="content">
            <div class="title">{{ event.title }}</div>
            <div class="meta">
              <span class="meta-item">{{ getPlaceName() }}</span>
              <span class="meta-item price">{{ formatPrice(event.price ?? 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
    <button class="remove-button" @click="removeFromFavorites">Удалить</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FavoritesEventCard'
});
</script>

<script lang="ts" setup>
import type { EventType } from '@/shared/models/eventsModel';
import { PLACES_DICT } from '@/shared/models/placesModel';
import { RouteNames } from '@/shared/router';
import { API_BASE_URL } from '@/config';

type FavoritesEventCardProps = {
  event: EventType;
};
const emit = defineEmits(['remove']);
const props = defineProps<FavoritesEventCardProps>();

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

function removeFromFavorites() {
  emit('remove', props.event.id);
}
</script>

<style scoped>
.event-card.favorites {
  position: relative;
  width: 100%;
  max-width: 300px; /* Компактная ширина */
  min-width: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-container {
  position: relative;
  height: 200px; /* Компактная высота */
  background-size: cover;
  background-position: center;
  color: #fff;
}

.card-link {
  display: block;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
}

.date-time {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date {
  font-size: 18px;
  font-weight: 700;
}

.time {
  font-size: 14px;
  font-weight: 500;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
}

.meta-item {
  color: #fff;
}

.price {
  font-weight: 700;
  color: #2196f3; /* Акцент на цене */
}

.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.remove-button:hover {
  background: #d32f2f;
}

@media (max-width: 767px) {
  .event-card.favorites {
    max-width: 100%;
  }

  .card-container {
    height: 180px;
  }

  .date {
    font-size: 16px;
  }

  .time {
    font-size: 12px;
  }

  .title {
    font-size: 16px;
  }

  .meta {
    font-size: 12px;
  }

  .remove-button {
    padding: 5px 10px;
    font-size: 10px;
  }
}
</style>
