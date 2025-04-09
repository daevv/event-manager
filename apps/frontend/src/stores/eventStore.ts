// stores/eventStore.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { EventType } from '@/shared/models/eventsModel';
import axios from 'axios';
import axiosInstance from '@/axiosInstance';

export interface Place {
  id: string;
  title: string;
}

export interface Filters {
  places: string[];
  cost: 'all' | 'free' | 'paid';
  categories: string[];
  dateFrom: string | null;
  dateTo: string | null;
  searchQuery: string;
}

export const useEventStore = defineStore('event', () => {
  const events = ref<EventType[]>([]);
  const organizedEvents = ref<EventType[]>([]);
  const administratedEvents = ref<EventType[]>([]);
  const registeredEvents = ref<EventType[]>([]);
  const placesDict = ref<Record<string, Place>>({});
  const filters = ref<Filters>({
    places: [],
    cost: 'all',
    categories: [],
    dateFrom: null,
    dateTo: null,
    searchQuery: ''
  });
  const sortBy = ref<'relevance' | 'date' | 'price'>('relevance');
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get('events');

      const data: EventType[] = response.data;
      events.value = data.map((event) => ({
        ...event,
        dateTime: new Date(event.dateTime)
      }));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Ошибка при загрузке событий'
        : (err as Error).message || 'Произошла ошибка';

      error.value = errorMessage;
      console.error('Axios events error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchOrganizedEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get(`users/organizedEvents`);
      const data: EventType[] = response.data;
      organizedEvents.value = data.map((event) => ({
        ...event,
        dateTime: new Date(event.dateTime)
      }));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Ошибка при загрузке организованных событий'
        : (err as Error).message || 'Произошла ошибка';

      error.value = errorMessage;
      console.error('Axios organizedEvents error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchAdministratedEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get(`users/administeredEvents`);
      const data: EventType[] = response.data;
      administratedEvents.value = data.map((event) => ({
        ...event,
        dateTime: new Date(event.dateTime)
      }));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Ошибка при загрузке администрируемых событий'
        : (err as Error).message || 'Произошла ошибка';

      error.value = errorMessage;
      console.error('Axios administratedEvents error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchRegisteredEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get(`users/registeredEvents`);
      const data: EventType[] = response.data;
      registeredEvents.value = data.map((event) => ({
        ...event,
        dateTime: new Date(event.dateTime)
      }));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Ошибка при загрузке зарегистрированных событий'
        : (err as Error).message || 'Произошла ошибка';

      error.value = errorMessage;
      console.error('Axios registeredEvents error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchEventById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Проверяем, есть ли событие уже в сторе
      const existingEvent = events.value.find((e) => e.id === id);
      if (existingEvent) return existingEvent;

      const response = await axiosInstance.get(`events/${id}`);

      const event: EventType = response.data;
      events.value.push({ ...event, dateTime: new Date(event.dateTime) });
      return event;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Произошла ошибка'
        : (err as Error).message || 'Произошла ошибка';

      error.value = errorMessage;
      console.error('Axios event error:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // const fetchPlaces = async () => {
  //   try {
  //     const response = await fetch('http://localhost:2000/places', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`
  //       }
  //     });
  //     if (!response.ok) throw new Error('Ошибка при загрузке мест');
  //     const data: Place[] = await response.json();
  //     placesDict.value = data.reduce((acc, place) => {
  //       acc[place.id] = place;
  //       return acc;
  //     }, {} as Record<string, Place>);
  //   } catch (err) {
  //     console.error('Fetch places error:', err);
  //   }
  // };

  const filteredEvents = computed(() => {
    let result = [...events.value];
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter((event) => event.title.toLowerCase().includes(query));
    }
    if (filters.value.places.length > 0) {
      result = result.filter(
        (event) => event.placeId && filters.value.places.includes(event.placeId)
      );
    }
    if (filters.value.cost !== 'all') {
      result = result.filter((event) =>
        filters.value.cost === 'free' ? event.isFree : !event.isFree
      );
    }
    if (filters.value.categories.length > 0) {
      result = result.filter((event) => filters.value.categories.includes(event.category));
    }
    if (filters.value.dateFrom || filters.value.dateTo) {
      result = result.filter((event) => {
        const eventDate = new Date(event.dateTime);
        const fromDate = filters.value.dateFrom
          ? new Date(filters.value.dateFrom)
          : new Date('1900-01-01');
        const toDate = filters.value.dateTo
          ? new Date(filters.value.dateTo)
          : new Date('2100-12-31');
        return eventDate >= fromDate && eventDate <= toDate;
      });
    }
    return result;
  });

  const sortedEvents = computed(() => {
    const sorted = [...filteredEvents.value];
    if (sortBy.value === 'date') {
      sorted.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else if (sortBy.value === 'price') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  });

  const setFilters = (newFilters: Partial<Filters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const setSortBy = (value: 'relevance' | 'date' | 'price') => {
    sortBy.value = value;
  };

  return {
    events,
    placesDict,
    filters,
    sortBy,
    loading,
    error,
    filteredEvents,
    sortedEvents,
    fetchEvents,
    fetchEventById,
    fetchAdministratedEvents,
    fetchOrganizedEvents,
    fetchRegisteredEvents,
    administratedEvents,
    organizedEvents,
    registeredEvents,
    //fetchPlaces,
    setFilters,
    setSortBy
  };
});
