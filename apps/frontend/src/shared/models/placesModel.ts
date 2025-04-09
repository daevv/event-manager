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
    title: 'Красная Площадь',
    maxCapacity: 5000,
    description:
      'Историческая площадь в центре Москвы, место проведения крупных мероприятий и фестивалей.'
  },
  2: {
    coordinates: {
      latitude: 59.9343,
      longitude: 30.3351
    },
    title: 'Дворцовая Площадь',
    maxCapacity: 3000,
    description:
      'Центральная площадь Санкт-Петербурга, окружённая Зимним дворцом, идеальна для культурных событий.'
  },
  3: {
    coordinates: {
      latitude: 55.8304,
      longitude: 49.0661
    },
    title: 'Казанский Кремль',
    maxCapacity: 2000,
    description:
      'Исторический комплекс в Казани, подходящий для выставок и исторических реконструкций.'
  },
  4: {
    coordinates: {
      latitude: 56.8389,
      longitude: 60.6057
    },
    title: 'Площадь 1905 года',
    maxCapacity: 1500,
    description:
      'Главная площадь Екатеринбурга, часто используется для городских праздников и концертов.'
  },
  5: {
    coordinates: {
      latitude: 43.5855,
      longitude: 39.7203
    },
    title: 'Олимпийский Парк Сочи',
    maxCapacity: 10000,
    description:
      'Современный комплекс в Сочи, идеально подходит для спортивных мероприятий и фестивалей.'
  },
  6: {
    coordinates: {
      latitude: 54.9893,
      longitude: 73.3682
    },
    title: 'Набережная Иртыша',
    maxCapacity: 800,
    description:
      'Живописная набережная в Омске, подходящая для небольших мероприятий на открытом воздухе.'
  },
  7: {
    coordinates: {
      latitude: 55.0084,
      longitude: 82.9357
    },
    title: 'Площадь Ленина',
    maxCapacity: 2500,
    description:
      'Центральная площадь Новосибирска, место для проведения ярмарок и городских праздников.'
  },
  8: {
    coordinates: {
      latitude: 51.5336,
      longitude: 46.0342
    },
    title: 'Театральная Площадь',
    maxCapacity: 1200,
    description:
      'Площадь в Саратове, окружённая театрами, подходит для культурных и театральных событий.'
  },
  9: {
    coordinates: {
      latitude: 56.3269,
      longitude: 44.0059
    },
    title: 'Нижегородский Кремль',
    maxCapacity: 1800,
    description:
      'Историческое место в Нижнем Новгороде, идеально для выставок и исторических мероприятий.'
  },
  10: {
    coordinates: {
      latitude: 47.2357,
      longitude: 39.7015
    },
    title: 'Парк Революции',
    maxCapacity: 600,
    description:
      'Зелёный парк в Ростове-на-Дону, подходящий для пикников, мастер-классов и небольших концертов.'
  }
};
