export enum STATUSES_MODEL {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PLANNING = 'PLANNING'
}

export interface EventType {
  id: string;
  title: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  description: string;
  dateTime: Date;
  isFree: boolean;
  isLocal: boolean;
  isFavourite: boolean;
  groupId: string | null;
  price: number | null;
  categories: string[];
  image: string;
  participantsCount: number;
  maxParticipantsCount: number | null;
  organizerId: number;
  imageUrl: string | null;
  meetingUrl: string | null;
  eventStatus: STATUSES_MODEL;
  createdAt?: Date; // Опционально
  updatedAt?: Date; // Опционально
}
