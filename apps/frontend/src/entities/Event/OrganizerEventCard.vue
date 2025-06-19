<template>
  <router-link
    :to="{ name: RouteNames.EVENT_DETAILS, params: { id: event.id } }"
    class="event-card organizer"
    neu
  >
    <div class="card-container" :style="{ backgroundImage: `url(${getImgSrc()})` }">
      <div class="overlay">
        <div class="content">
          <div class="title">{{ event.title }}</div>
          <div class="meta">
            <span class="meta-item date"
              >{{ formatDate(event.dateTime) }} • {{ formatTime(event.dateTime) }}</span
            >
            <span class="meta-item place">{{ getPlaceName() }}</span>
            <span class="meta-item price">{{ formatPrice(event.price ?? 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OrganizerEventCard'
});
</script>

<script lang="ts" setup>
import type { EventType } from '@/shared/models/eventsModel';
import { PLACES_DICT } from '@/shared/models/placesModel';
import { RouteNames } from '@/shared/router';
import { API_BASE_URL } from '@/config';

type OrganizerEventCardProps = {
  event: EventType;
};
const props = defineProps<OrganizerEventCardProps>();

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
</script>

<style scoped>
.event-card.organizer {
  width: 100%;
  max-width: 280px; /* Компактная ширина */
  min-width: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card.organizer:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.card-container {
  position: relative;
  height: 350px; /* Вертикальная ориентация */
  background-size: cover;
  background-position: center;
  color: #fff;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.organizer-header {
  background: #2196f3; /* Акцент на организатора */
  padding: 10px 15px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.organizer {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.meta-item {
  color: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.date {
  font-weight: 600;
}

.place {
  opacity: 0.9;
}

.price {
  font-weight: 700;
  color: #2196f3; /* Акцент на цене */
}

@media (max-width: 767px) {
  .event-card.organizer {
    max-width: 100%;
  }

  .card-container {
    height: 300px;
  }

  .organizer {
    font-size: 12px;
  }

  .title {
    font-size: 18px;
  }

  .meta {
    font-size: 12px;
  }
}
</style>
