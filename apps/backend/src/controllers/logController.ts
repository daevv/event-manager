import { Request, Response } from 'express';
import Log from '@/models/log';
import { logger } from '@/services/logger';
import { Op } from 'sequelize';

export async function getLogs(req: Request, res: Response) {
  try {
    // Получаем параметры запроса
    const { userId, method, status, startDate, endDate, page = 1, limit = 50 } = req.query;

    // Формируем условия фильтрации
    const where: any = { level: 'http' };

    if (userId) where.userId = userId;
    if (method) where.method = method;
    if (status) where.status = Number(status);

    // Фильтрация по дате
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate as string);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate as string);
    }

    // Вычисляем offset для пагинации
    const offset = (Number(page) - 1) * Number(limit);

    // Получаем логи с учетом фильтров
    const { count, rows } = await Log.findAndCountAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch logs', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}