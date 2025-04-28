import type { CATEGORY_MODEL } from '@/shared/models/categoryModel';
import type { STATUSES_MODEL } from '@/shared/models/statusesModel';

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
  categories: CATEGORY_MODEL[];
  image: string;
  participantsCount: number;
  maxParticipantsCount: number | null;
  organizerId: number;
  imageUrl: string | null;
  eventStatus: STATUSES_MODEL;
  createdAt?: Date; // Опционально
  updatedAt?: Date; // Опционально
}
