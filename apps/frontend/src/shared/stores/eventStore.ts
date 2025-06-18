// stores/eventStore.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { EventType } from '@/shared/models/eventsModel';
import axios from 'axios';
import axiosInstance from '@/shared/utilities/axiosInstance';

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
  // State
  const events = ref<EventType[]>([]);
  const favouriteEvents = ref<EventType[]>([]);
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

  const filteredEvents = computed(() => {
    let result = [...events.value];

    // Фильтрация по поисковому запросу
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter((event) => event.title.toLowerCase().includes(query));
    }

    // Фильтрация по цене
    if (filters.value.cost !== 'all') {
      result = result.filter((event) =>
        filters.value.cost === 'free' ? event?.price <= 0 : event.price > 0
      );
    }

    // Фильтрация по категориям
    if (filters.value.categories.length > 0) {
      result = result.filter((event) => filters.value.categories.includes(event.category));
    }

    // Фильтрация по дате
    if (filters.value.dateFrom || filters.value.dateTo) {
      const fromDate = filters.value.dateFrom
        ? new Date(filters.value.dateFrom)
        : new Date('1900-01-01');
      const toDate = filters.value.dateTo ? new Date(filters.value.dateTo) : new Date('2100-12-31');

      result = result.filter((event) => {
        const eventDate = new Date(event.dateTime);
        return eventDate >= fromDate && eventDate <= toDate;
      });
    }

    return result;
  });

  const sortedEvents = computed(() => {
    const sorted = [...filteredEvents.value];

    switch (sortBy.value) {
      case 'date':
        sorted.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        break;
      case 'price':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      default:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  });

  // Helpers
  const handleError = (err: unknown, defaultMessage: string): string => {
    const errorMessage = axios.isAxiosError(err)
      ? err.response?.data?.message || defaultMessage
      : (err as Error).message || defaultMessage;

    error.value = errorMessage;
    console.error('Axios error:', err);
    return errorMessage;
  };

  const normalizeEvent = (event: EventType): EventType => ({
    ...event,
    dateTime: new Date(event.dateTime)
  });

  // Actions
  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get('events');
      events.value = response.data.map(normalizeEvent);
    } catch (err) {
      handleError(err, 'Ошибка при загрузке событий');
    } finally {
      loading.value = false;
    }
  };

  const fetchOrganizedEvents = async (organizerId?: string) => {
    const currentUserId = localStorage.getItem('userId');
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get(
        `users/organizedEvents/${organizerId ?? currentUserId}`
      );
      const events = response.data.map(normalizeEvent);
      if (organizerId) {
        return events;
      } else organizedEvents.value = events;
    } catch (err) {
      handleError(err, 'Ошибка при загрузке организованных событий');
    } finally {
      loading.value = false;
    }
  };

  const fetchAdministratedEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get('users/administeredEvents');
      administratedEvents.value = response.data.map(normalizeEvent);
    } catch (err) {
      handleError(err, 'Ошибка при загрузке администрируемых событий');
    } finally {
      loading.value = false;
    }
  };

  const fetchRegisteredEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get('users/registeredEvents');
      registeredEvents.value = response.data.map(normalizeEvent);
    } catch (err) {
      handleError(err, 'Ошибка при загрузке зарегистрированных событий');
    } finally {
      loading.value = false;
    }
  };

  const fetchEventById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const existingEvent = events.value.find((e) => e.id === id);
      if (existingEvent) return existingEvent;

      const response = await axiosInstance.get(`events/${id}`);
      const event = normalizeEvent(response.data);

      events.value.push(event);
      return event;
    } catch (err) {
      handleError(err, 'Ошибка при загрузке события');
      return null;
    } finally {
      loading.value = false;
    }
  };

  const register = async (id: string, email: string) => {
    loading.value = true;

    try {
      const response = await axiosInstance.post(`events/${id}/register`, { email });
      const event = normalizeEvent(response.data);

      registeredEvents.value.push(event);
      return event;
    } catch (err) {
      handleError(err, 'Ошибка при регистрации на событие');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const unregister = async (eventId: string, email: string) => {
    loading.value = true;

    try {
      await axiosInstance.post(`events/${eventId}/unregister`, { email });
      registeredEvents.value = registeredEvents.value.filter((event) => event.id !== eventId);
    } catch (err) {
      handleError(err, 'Ошибка при отмене регистрации');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchEventParticipants = async (eventId: string | number) => {
    loading.value = true;
    try {
      const response = await axiosInstance.get(`/events/${eventId}/participants`);

      // Преобразуем ответ, извлекая пользователей
      return response.data.map((reg) => reg.user);
    } catch (error: any) {
      throw 'Ошибка при загрузке участников';
    } finally {
      loading.value = false;
    }
  };

  const toggleFavourite = async (id: string) => {
    loading.value = true;

    try {
      const currentEvent = events.value.find((event) => event.id === id);
      await axiosInstance.put(`events/${id}/favourite`);

      // Оптимистичное обновление
      const eventIndex = favouriteEvents.value.findIndex((event) => event.id === id);
      if (eventIndex !== -1) {
        favouriteEvents.value.push(currentEvent);
      } else {
        favouriteEvents.value = favouriteEvents.value.filter((event) => event.id !== id);
      }
    } catch (err) {
      handleError(err, 'Ошибка при изменении статуса "избранное"');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getEventAdmins = async (id: string) => {
    loading.value = true;

    try {
      const { data: admins } = await axiosInstance.put(`events/${id}/admins`);

      return admins;
    } catch (err) {
      handleError(err, 'Ошибка при изменении статуса "избранное"');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateEvent = async (id: string, formData: FormData) => {
    loading.value = true;
    console.log(formData);

    try {
      await fetch(`http://localhost:2000/events/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
    } catch (err) {
      handleError(err, 'Ошибка при изменении события');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const setFilters = (newFilters: Partial<Filters>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const setSortBy = (value: 'relevance' | 'date' | 'price') => {
    sortBy.value = value;
  };

  return {
    // State
    events,
    organizedEvents,
    administratedEvents,
    registeredEvents,
    placesDict,
    filters,
    sortBy,
    loading,
    error,

    // Getters
    favouriteEvents,
    filteredEvents,
    sortedEvents,
    fetchEventParticipants,

    // Actions
    fetchEvents,
    fetchEventById,
    fetchOrganizedEvents,
    fetchAdministratedEvents,
    fetchRegisteredEvents,
    toggleFavourite,
    register,
    unregister,
    setFilters,
    updateEvent,
    getEventAdmins,
    setSortBy
  };
});
