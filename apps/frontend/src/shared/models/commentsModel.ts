// src/types/comment.ts
export interface CommentType {
  id: number;
  eventId: number;
  authorId: number;
  text: string;
}

export const COMMENTS: CommentType[] = [
  { id: 1, eventId: 1, authorId: 2, text: 'Отличное мероприятие, всем советую!' },
  { id: 2, eventId: 1, authorId: 3, text: 'Было очень весело!' },
  { id: 3, eventId: 2, authorId: 1, text: 'Музыка на высоте!' }
];
