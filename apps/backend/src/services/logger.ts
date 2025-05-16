import winston from 'winston';
import Log from '@/models/log';
import { Request, Response } from 'express';

// Winston только для файлов и консоли
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level}]: ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Кастомный поток для Morgan, пишет HTTP-логи в PostgreSQL
export const morganToDb = () => {
  if (!Log) {
    throw new Error('Log model is not initialized!');
  }
  return {
    write: async (message: string) => {
      try {
        // Парсим сообщение Morgan (формат 'combined')
        const logEntry = parseMorganMessage(message);
        // Добавляем userId из meta (если есть)

        await Log.create({
          level: 'http',
          message: 'HTTP request',
          timestamp: new Date(),
          method: logEntry.method,
          url: logEntry.url,
          status: logEntry.status,
          responseTime: logEntry.responseTime,
          userAgent: logEntry.userAgent,
          userId: logEntry.userId, // <-- Добавляем userId
          ip: logEntry.ip,
          meta: {
            rawMessage: message.trim(),
            ...(logEntry.userId && { userId: logEntry.userId }) // Дублируем в meta для поиска
          }
        });
      } catch (error) {
        logger.error('Failed to save HTTP log to database', { error });
      }
    }
  };
};

// Парсер сообщения Morgan в формате 'combined'
const parseMorganMessage = (message: string, req?: Request) => {
  const parts = message.split(' ');
  return {
    ip: parts[0] || '',
    method: parts[0]?.replace('"', '') || '',
    url: parts[1] || '',
    status: parseInt(parts[2]) || 0,
    responseTime: parts[3] + ' ' + parts[4] || '',
    userAgent: '',
    userId: parts[5] || '',
    meta: {
      rawMessage: message.trim()
    }
  };
};

// Middleware для дополнительной информации в логах
export const httpLoggingMiddleware = (req: Request, res: Response, next: () => void) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`HTTP ${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
  });

  next();
};
