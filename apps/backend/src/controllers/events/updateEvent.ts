import { Request, Response } from 'express';
import Event from '@/models/event.model';

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    organiserId,
    maxCapacity,
    participantsId,
    dateStart,
    dateEnd,
    placeId,
    isLocal,
    rating,
    price,
    city
  } = req.body;

  try {
    // Находим мероприятие по ID
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Обновляем мероприятие
    await event.update({
      title,
      description,
      organiserId,
      maxCapacity,
      participantsId: participantsId,
      dateStart,
      dateEnd,
      placeId,
      isLocal,
      rating,
      price,
      city
    });

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating event', error });
  }
};
