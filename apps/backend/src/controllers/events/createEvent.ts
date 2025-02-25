import { Request, Response } from 'express';
import Event from '@/models/event.model';

export const createEvent = async (req: Request, res: Response) => {
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
    // Создаем новое мероприятие
    const event = await Event.create({
      title,
      description,
      organiserId,
      maxCapacity,
      participantsId: participantsId || [],
      dateStart,
      dateEnd,
      placeId,
      isLocal,
      rating,
      price,
      city,
      dateCreate: new Date() // Записываем текущую дату как дату создания
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event', error });
  }
};
