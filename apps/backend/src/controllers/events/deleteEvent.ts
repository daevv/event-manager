import { sequelize } from '@/config/db';
import { Request, Response } from 'express';
import Event from '@/models/event.model';
import Comment from '@/models/comment.model';

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const event = await Event.findByPk(id, { transaction });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organiserId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this event' });
    }

    // Удаление комментариев в рамках транзакции
    await Comment.destroy({ where: { eventId: id }, transaction });

    // Удаление мероприятия в рамках транзакции
    await event.destroy({ transaction });

    // Подтверждение транзакции
    await transaction.commit();

    res.status(200).json({ message: 'Event and associated comments deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error deleting event and comments', error });
  }
};
