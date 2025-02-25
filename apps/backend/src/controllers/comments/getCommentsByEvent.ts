import { Request, Response } from 'express';
import Comment from '@/models/comment.model';

export const getCommentsByEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    // Получаем все комментарии для мероприятия с указанным eventId
    const comments = await Comment.findAll({
      where: {
        eventId: eventId
      }
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this event' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};
