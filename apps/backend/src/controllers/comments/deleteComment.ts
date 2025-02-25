import { Request, Response } from 'express';
import Comment from '@/models/comment.model';

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Находим и удаляем комментарий по ID
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};
