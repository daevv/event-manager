// src/types/log.ts
export interface LogType {
  id: number;
  action: string;
  userId: number | null;
  eventId: number | null;
  timestamp: string;
}

export const LOGS: LogType[] = [
  {
    id: 1,
    action: 'Создание аккаунта',
    userId: 1,
    eventId: null,
    timestamp: '2025-03-01 10:00:00'
  },
  {
    id: 2,
    action: 'Создание мероприятия',
    userId: 1,
    eventId: 1,
    timestamp: '2025-03-02 12:00:00'
  },
  {
    id: 3,
    action: 'Создание аккаунта',
    userId: 2,
    eventId: null,
    timestamp: '2025-03-03 14:00:00'
  },
  { id: 4, action: 'Удаление мероприятия', userId: 2, eventId: 2, timestamp: '2025-03-04 16:00:00' }
];
