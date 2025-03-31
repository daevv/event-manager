import { Request, Response } from 'express';
import Log from '@/models/log.model';

export const addLog = async (req: Request, res: Response) => {
  const { action, userId, eventId } = req.body;

  try {
    // Создаем новый комментарий
    const log = await Log.create({
      action,
      userId,
      eventId
    });

    res.status(201).json({ message: 'Log added successfully', log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding log', error });
  }
};
