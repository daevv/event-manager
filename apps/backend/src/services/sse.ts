// src/server/sse.ts
import { Request, Response } from 'express';

// Хранилище подключенных клиентов
const clients = new Set<Response>();

// Middleware для SSE подключения
export const sseMiddleware = (req: Request, res: Response) => {
  // Устанавливаем заголовки SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  // Добавляем клиента в хранилище
  clients.add(res);

  // Отправляем начальное сообщение
  res.write('data: Connected\n\n');

  // Обработка отключения клиента
  req.on('close', () => {
    clients.delete(res);
    res.end();
  });
};

// Функция для рассылки событий всем клиентам
export const sendEventToAll = (data: object, eventName?: string) => {
  const eventData = `data: ${JSON.stringify(data)}\n\n`;
  const event = eventName ? `event: ${eventName}\n${eventData}` : eventData;

  clients.forEach((client) => {
    try {
      client.write(event);
    } catch (e) {
      // Удаляем отключенных клиентов
      clients.delete(client);
    }
  });
};
