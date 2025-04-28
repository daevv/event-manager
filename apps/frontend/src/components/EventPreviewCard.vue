<template>
  <div class="event-preview">
    <div class="preview-header">
      <h2 class="preview-title">{{ event.title }}</h2>
      <div :class="event.isLocal ? 'local' : 'online'" class="preview-badge">
        {{ event.isLocal ? 'Local Event' : 'Online Event' }}
      </div>
    </div>

    <div v-if="event.imageUrl" class="preview-image-container">
      <img :src="event.imageUrl" alt="Event preview" class="preview-image" />
    </div>

    <div class="preview-details">
      <div class="detail-row">
        <div class="detail-icon">
          <svg
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
              fill="currentColor"
            />
            <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor" />
          </svg>
        </div>
        <div class="detail-text">
          {{ formatDateTime(event.dateTime) }}
        </div>
      </div>

      <div v-if="event.isLocal && event.l" class="detail-row">
        <div class="detail-icon">
          <svg
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="detail-text">
          {{ getPlaceName() }}
        </div>
      </div>

      <div v-if="!event.isLocal" class="detail-row">
        <div class="detail-icon">
          <svg
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="detail-text">Online Event</div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">
          <svg
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.07 18.28C7.5 17.38 10.12 16.5 12 16.5C13.88 16.5 16.51 17.38 16.93 18.28C15.57 19.36 13.86 20 12 20C10.14 20 8.43 19.36 7.07 18.28ZM18.36 16.83C16.93 15.09 13.46 14.5 12 14.5C10.54 14.5 7.07 15.09 5.64 16.83C4.62 15.49 4 13.82 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.82 19.38 15.49 18.36 16.83ZM12 6C10.06 6 8.5 7.56 8.5 9.5C8.5 11.44 10.06 13 12 13C13.94 13 15.5 11.44 15.5 9.5C15.5 7.56 13.94 6 12 6ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="detail-text">
          {{
            event.maxParticipantsCount
              ? `Up to ${event.maxParticipantsCount} participants`
              : 'Unlimited participants'
          }}
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">
          <svg
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="currentColor"
            />
            <path
              d="M12.31 11.23C12.21 11.22 12.11 11.22 12 11.22C11.89 11.22 11.79 11.22 11.69 11.23C9.39 11.13 7.56 9.28 7.56 7C7.56 4.69 9.45 2.8 11.76 2.8C14.07 2.8 15.96 4.69 15.96 7C15.95 9.28 14.12 11.13 11.83 11.23H12.31Z"
              fill="currentColor"
            />
            <path
              d="M16.67 13.83C15.2 12.17 13.18 11.4 11.15 11.4C9.12 11.4 7.1 12.18 5.63 13.83C4.64 14.9 4.1 16.28 4.1 17.69C4.1 18.56 4.33 19.42 4.78 20.18C6.12 22.45 8.61 24 11.25 24C13.89 24 16.38 22.45 17.72 20.18C18.17 19.42 18.4 18.56 18.4 17.69C18.4 16.28 17.86 14.9 16.67 13.83Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="detail-text">
          {{ event.isFree ? 'Free' : `$${event.price}` }}
        </div>
      </div>
    </div>

    <div class="preview-description">
      <h3 class="section-title">Description</h3>
      <p class="description-text">{{ event.description }}</p>
    </div>

    <div v-if="event.categories.length > 0" class="preview-categories">
      <h3 class="section-title">Categories</h3>
      <div class="categories-list">
        <span v-for="(category, index) in event.categories" :key="index" class="category-tag">
          {{ category }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  event: {
    type: Object as () => {
      title: string;
      description: string;
      categories: string[];
      dateTime: string;
      isLocal: boolean;
      groupId: string | null;
      maxParticipantsCount: number | null;
      price: number;
      location: {
        lat: number;
        lng: number;
        address: string;
      } | null;
      isFree: boolean;
      imageUrl: string;
    },
    required: true
  }
});

const formatDateTime = (dateTime: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateTime).toLocaleDateString('en-US', options);
};

const getPlaceName = () => {
  return 'place';
};
</script>

<style scoped>
.event-preview {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
  position: relative;
}

.preview-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
}

.preview-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-badge.local {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.preview-badge.online {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.preview-image-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.preview-details {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-right: 1rem;
}

.detail-text {
  font-size: 0.9375rem;
  color: var(--color-text);
}

.preview-description {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
}

.description-text {
  margin: 0;
  line-height: 1.6;
  color: var(--color-text);
}

.preview-categories {
  padding: 1.5rem;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 20px;
  font-size: 0.8125rem;
}
</style>
