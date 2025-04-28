<template>
  <div class="location-picker">
    <!-- Поле поиска -->
    <div class="search-container">
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="Введите адрес (например: Москва, ул. Тверская)"
        @keydown.enter="searchLocation"
      />
      <button class="search-button" @click="searchLocation">
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
        </svg>
      </button>
    </div>

    <!-- Контейнер для карты -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- Информация о выбранной локации -->
    <div v-if="selectedLocation" class="location-info">
      <div class="address">{{ selectedLocation.address || 'Адрес не определен' }}</div>
      <div class="coordinates">
        Широта: {{ selectedLocation.lat.toFixed(6) }}, Долгота:
        {{ selectedLocation.lng.toFixed(6) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Иконки для маркера (исправляем проблему с отображением в сборке)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Пропсы и эмиты
const props = defineProps({
  modelValue: {
    type: Object as () => {
      lat: number;
      lng: number;
      address?: string;
    } | null,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

// Реактивные переменные
const mapContainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const searchQuery = ref('');
const selectedLocation = ref<{
  lat: number;
  lng: number;
  address?: string;
} | null>(null);

// Инициализация карты
onMounted(() => {
  if (!mapContainer.value) return;

  map.value = L.map(mapContainer.value).setView([55.751244, 37.618423], 13); // Москва по умолчанию

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);

  // Обработчик клика по карте
  map.value.on('click', (e: L.LeafletMouseEvent) => {
    updateLocation(e.latlng.lat, e.latlng.lng);
  });

  // Если есть начальное значение
  if (props.modelValue) {
    updateLocation(props.modelValue.lat, props.modelValue.lng, props.modelValue.address);
  }
});

// Поиск локации по адресу
async function searchLocation() {
  if (!searchQuery.value.trim()) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery.value
      )}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const firstResult = data[0];
      updateLocation(
        parseFloat(firstResult.lat),
        parseFloat(firstResult.lon),
        firstResult.display_name
      );
    }
  } catch (error) {
    console.error('Ошибка при поиске адреса:', error);
  }
}

// Обновление позиции на карте
function updateLocation(lat: number, lng: number, address?: string) {
  if (!map.value) return;

  // Сохраняем данные
  selectedLocation.value = { lat, lng, address };
  emit('update:modelValue', selectedLocation.value);

  // Центрируем карту
  map.value.setView([lat, lng], 15);

  // Обновляем/добавляем маркер
  if (marker.value) {
    marker.value.setLatLng([lat, lng]);
  } else {
    marker.value = L.marker([lat, lng]).addTo(map.value);
  }
}

// Следим за изменениями извне
watch(
  () => props.modelValue,
  (newValue) => {
    if (
      newValue &&
      (!selectedLocation.value ||
        newValue.lat !== selectedLocation.value.lat ||
        newValue.lng !== selectedLocation.value.lng)
    ) {
      updateLocation(newValue.lat, newValue.lng, newValue.address);
    }
  }
);
</script>

<style scoped>
.location-picker {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  padding: 8px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #3a86ff;
}

.search-button {
  padding: 0 12px;
  background: #3a86ff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.search-button:hover {
  background: #2667cc;
}

.map-container {
  height: 400px;
  width: 100%;
}

.location-info {
  padding: 12px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 14px;
}

.address {
  font-weight: 500;
  margin-bottom: 4px;
}

.coordinates {
  color: #6c757d;
  font-size: 13px;
}
</style>
