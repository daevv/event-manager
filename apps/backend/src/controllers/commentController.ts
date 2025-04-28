import { Request, Response } from 'express';
import Comment from '@/models/сomment';
import Event from '../models/event';

export const createComment = async (req: Request, res: Response) => {
  const { text, rating, eventId } = req.body;

  // Проверяем существование мероприятия
  const event = await Event.findByPk(eventId);
  if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

  // Валидация рейтинга
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Оценка должна быть целым числом от 1 до 5' });
  }
  const comment = await Comment.create({
    text,
    rating,
    userId: req.user?.id,
    eventId
  });

  res.status(201).json(comment);
};

export const updateComment = async (req: Request, res: Response) => {
  const { text, rating } = req.body;
  const comment = await Comment.findByPk(req.params.id);

  if (!comment) return res.status(404).json({ message: 'Комментарий не найден' });
  if (comment.user_id !== req.user?.id) {
    return res.status(403).json({ message: 'Вы можете редактировать только свои комментарии' });
  }

  // Валидация рейтинга, если он указан
  if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Оценка должна быть целым числом от 1 до 5' });
  }

  await comment.update({ text: text || comment.text, rating: rating || comment.rating });
  res.json(comment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const comment = await Comment.findByPk(req.params.id);

  if (!comment) return res.status(404).json({ message: 'Комментарий не найден' });
  if (comment.user_id !== req.user?.id) {
    return res.status(403).json({ message: 'Вы можете удалять только свои комментарии' });
  }

  await comment.destroy();
  res.json({ message: 'Комментарий удален' });
};

export const getCommentsByEvent = async (req: Request, res: Response) => {
  const event = await Event.findByPk(req.params.event_id);
  if (!event) return res.status(404).json({ message: 'Мероприятие не найдено' });

  const comments = await Comment.findAll({
    where: { event_id: req.params.event_id }
    // include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
  });

  res.json(comments);
};
