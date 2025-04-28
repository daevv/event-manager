// types/place.ts
// Определяем интерфейс для места
export interface Place {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  title: string;
  maxCapacity: number;
  description: string;
}

// Определяем тип для словаря мест
export type PlacesDict = Record<number, Place>;

// Константа PLACES_DICT с 10 местами
export const PLACES_DICT: PlacesDict = {
  1: {
    coordinates: {
      latitude: 55.7558,
      longitude: 37.6173
    },
    title: 'Санкт-Петербург',
    maxCapacity: 5000,
    description:
      'Историческая площадь в центре Москвы, место проведения крупных мероприятий и фестивалей.'
  },
  2: {
    coordinates: {
      latitude: 59.9343,
      longitude: 30.3351
    },
    title: 'Москва',
    maxCapacity: 3000,
    description:
      'Центральная площадь Санкт-Петербурга, окружённая Зимним дворцом, идеальна для культурных событий.'
  }
};
