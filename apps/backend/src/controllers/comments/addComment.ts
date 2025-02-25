import { Request, Response } from 'express';
import Comment from '@/models/comment.model';

export const addComment = async (req: Request, res: Response) => {
  const { content, authorId, eventId, rate } = req.body;

  try {
    // Создаем новый комментарий
    const comment = await Comment.create({
      content,
      authorId,
      eventId,
      rate
    });

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment', error });
  }
};
