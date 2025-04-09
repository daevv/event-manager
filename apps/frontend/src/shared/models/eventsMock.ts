// Массив с 10 мероприятиями
import type { EventType } from '@/shared/models/eventsModel';
import { CATEGORY_MODEL } from '@/shared/models/categoryModel';
import { STATUSES_MODEL } from '@/shared/models/statusesModel';

export const EVENTS: EventType[] = [
  {
    id: 1,
    title: 'Фестиваль классической музыки',
    placeId: 1, // Красная Площадь
    description: 'Ежегодный фестиваль классической музыки с участием известных оркестров.',
    date: {
      month: '06',
      day: 15,
      endDay: 16
    },
    time: '18:00 - 22:00',
    isFree: false,
    isLocal: false,
    localGroupId: null,
    price: '2000₽',
    category: CATEGORY_MODEL.MUSIC,
    image: 'event_card_1',
    participantsCount: 1200,
    maxParticipantsCount: 5000,
    organiserId: 101,
    eventStatus: STATUSES_MODEL.PLANNING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 2,
    title: 'Марафон "Бегом по Питеру"',
    placeId: 2, // Дворцовая Площадь
    description: 'Забег на 10 км по историческому центру Санкт-Петербурга.',
    date: {
      month: '07',
      day: 20
    },
    time: '08:00 - 12:00',
    isFree: false,
    isLocal: false,
    localGroupId: null,
    price: '1500₽',
    category: CATEGORY_MODEL.SPORTS,
    image: 'event_card_2',
    participantsCount: 800,
    maxParticipantsCount: 2000,
    organiserId: 102,
    eventStatus: STATUSES_MODEL.PLANNING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 3,
    title: 'Выставка современного искусства',
    placeId: 3, // Казанский Кремль
    description: 'Экспозиция работ современных художников Татарстана.',
    date: {
      month: '08',
      day: 10,
      endDay: 15
    },
    time: '10:00 - 18:00',
    isFree: true,
    isLocal: true,
    localGroupId: 301,
    price: null,
    category: CATEGORY_MODEL.ART,
    image: 'event_card_3',
    participantsCount: 300,
    maxParticipantsCount: 1000,
    organiserId: 103,
    eventStatus: STATUSES_MODEL.ONGOING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 4,
    title: 'Фестиваль уличной еды',
    placeId: 4, // Площадь 1905 года
    description: 'Дегустация блюд от лучших уличных поваров Екатеринбурга.',
    date: {
      month: '09',
      day: 5
    },
    time: '12:00 - 20:00',
    isFree: false,
    isLocal: true,
    localGroupId: 302,
    price: '500₽',
    category: CATEGORY_MODEL.FOOD,
    image: 'event_card_4',
    participantsCount: 600,
    maxParticipantsCount: 1500,
    organiserId: 104,
    eventStatus: STATUSES_MODEL.PLANNING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 5,
    title: 'Мастер-класс по программированию',
    placeId: 5, // Олимпийский Парк Сочи
    description: 'Интенсив по изучению JavaScript для начинающих.',
    date: {
      month: '10',
      day: 12
    },
    time: '14:00 - 18:00',
    isFree: false,
    isLocal: false,
    localGroupId: null,
    price: '3000₽',
    category: CATEGORY_MODEL.TECHNOLOGY,
    image: 'event_card_5',
    participantsCount: 50,
    maxParticipantsCount: 100,
    organiserId: 105,
    eventStatus: STATUSES_MODEL.PLANNING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 6,
    title: 'Йога на набережной',
    placeId: 6, // Набережная Иртыша
    description: 'Утренние занятия йогой с видом на реку.',
    date: {
      month: '06',
      day: 25
    },
    time: '07:00 - 08:30',
    isFree: true,
    isLocal: true,
    localGroupId: 303,
    price: null,
    category: CATEGORY_MODEL.HEALTH,
    image: 'event_card_6',
    participantsCount: 40,
    maxParticipantsCount: 80,
    organiserId: 106,
    eventStatus: STATUSES_MODEL.ONGOING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 7,
    title: 'Лекция по истории Сибири',
    placeId: 7, // Площадь Ленина, Новосибирск
    description: 'Образовательная лекция о культуре и истории Сибири.',
    date: {
      month: '11',
      day: 3
    },
    time: '15:00 - 17:00',
    isFree: true,
    isLocal: false,
    localGroupId: null,
    price: null,
    category: CATEGORY_MODEL.EDUCATION,
    image: 'event_card_7',
    participantsCount: 120,
    maxParticipantsCount: 300,
    organiserId: 107,
    eventStatus: STATUSES_MODEL.COMPLETED,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 8,
    title: 'Праздник народных традиций',
    placeId: 8, // Театральная Площадь, Саратов
    description: 'Фестиваль с народными танцами, песнями и ремеслами.',
    date: {
      month: '07',
      day: 8,
      endDay: 9
    },
    time: '11:00 - 19:00',
    isFree: true,
    isLocal: true,
    localGroupId: 304,
    price: null,
    category: CATEGORY_MODEL.CULTURE,
    image: 'event_card_8',
    participantsCount: 500,
    maxParticipantsCount: 1200,
    organiserId: 108,
    eventStatus: STATUSES_MODEL.COMPLETED,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 9,
    title: 'Поход по Волге',
    placeId: 9, // Нижегородский Кремль
    description: 'Групповой поход вдоль реки Волги с ночёвкой.',
    date: {
      month: '08',
      day: 20,
      endDay: 21
    },
    time: '09:00 - 17:00',
    isFree: false,
    isLocal: false,
    localGroupId: null,
    price: '2500₽',
    category: CATEGORY_MODEL.TRAVEL,
    image: 'event_card_9',
    participantsCount: 30,
    maxParticipantsCount: 50,
    organiserId: 109,
    eventStatus: STATUSES_MODEL.PLANNING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  },
  {
    id: 10,
    title: 'Благотворительный забег',
    placeId: 10, // Парк Революции, Ростов-на-Дону
    description: 'Забег на 5 км для сбора средств на помощь детям.',
    date: {
      month: '09',
      day: 15
    },
    time: '10:00 - 13:00',
    isFree: false,
    isLocal: true,
    localGroupId: 305,
    price: '1000₽',
    category: CATEGORY_MODEL.CHARITY,
    image: 'event_card_10',
    participantsCount: 200,
    maxParticipantsCount: 500,
    organiserId: 110,
    eventStatus: STATUSES_MODEL.PLANNING,
    adminIds: [1, 2],
    participants: [2, 3, 4]
  }
];
