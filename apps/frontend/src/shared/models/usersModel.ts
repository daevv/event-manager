// src/types/user.ts
export interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  role: 'user' | 'root';
}

export const USERS: UserType[] = [
  {
    id: 0,
    firstName: 'Админ',
    lastName: 'Админов',
    email: 'admin@daevpulse.com',
    isBlocked: false,
    role: 'root'
  },
  {
    id: 1,
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    isBlocked: false,
    role: 'user'
  },
  {
    id: 2,
    firstName: 'Анна',
    lastName: 'Петрова',
    email: 'anna@example.com',
    isBlocked: false,
    role: 'user'
  },
  {
    id: 3,
    firstName: 'Петр',
    lastName: 'Сидоров',
    email: 'petr@example.com',
    isBlocked: false,
    role: 'user'
  },
  {
    id: 4,
    firstName: 'Мария',
    lastName: 'Смирнова',
    email: 'maria@example.com',
    isBlocked: false,
    role: 'user'
  }
];
