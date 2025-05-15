import { Router } from 'express';
import { sendEventToAll, sseMiddleware } from '@/services/sse';

const router = Router();

// Эндпоинт для подключения SSE
router.get('/stream', sseMiddleware);

// Пример эндпоинта, который инициирует событие
router.post('/notify', (req, res) => {
  const { message } = req.body;

  // Отправляем событие всем подключенным клиентам
  sendEventToAll(
    {
      type: 'NOTIFICATION',
      message,
      timestamp: new Date().toISOString()
    },
    'notification'
  );

  res.json({ success: true });
});

export default router;
