import type { CATEGORY_MODEL } from '@/shared/models/categoryModel';
import type { STATUSES_MODEL } from '@/shared/models/statusesModel';

export interface EventType {
  id: string;
  title: string;
  placeId: string | null;
  description: string;
  dateTime: Date;
  isFree: boolean;
  isLocal: boolean;
  groupId: string | null;
  price: number | null;
  category: CATEGORY_MODEL;
  image: string;
  participantsCount: number;
  maxParticipantsCount: number | null;
  organizerId: number;
  imageUrl: string | null;
  eventStatus: STATUSES_MODEL;
  createdAt?: Date; // Опционально
  updatedAt?: Date; // Опционально
}
