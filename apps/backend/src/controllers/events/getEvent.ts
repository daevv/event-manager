import { Request, Response } from 'express';
import Event from '@/models/event.model';

export const getEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Находим мероприятие по ID
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching event', error });
  }
};
