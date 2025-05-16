import { io, Socket } from 'socket.io-client';

// Расширяем тип Socket для типизации
interface Notification {
  id?: string;
  type: string;
  title: string;
  content: string;
  eventId?: string;
  read?: boolean;
}

let socket: Socket | null = null;

export function initializeSocket(token: string | null): Socket {
  if (socket) {
    return socket; // Возвращаем существующий сокет, если он уже инициализирован
  }

  // Инициализируем новый сокет
  socket = io('http://localhost:2000', {
    auth: {
      token // Передаём токен для аутентификации
    },
    query: {
      userId: token ? getUserIdFromToken(token) : undefined // Опционально передаём userId
    }
  });

  // Логирование подключения
  socket.on('connect', () => {
    console.log('Подключено к Socket.IO', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Ошибка подключения к Socket.IO:', error.message);
  });

  socket.on('disconnect', () => {
    console.log('Отключено от Socket.IO');
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Сокет отключён');
  }
}

// Вспомогательная функция для извлечения userId из токена (если нужно)
function getUserIdFromToken(token: string): string | undefined {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id; // Предполагается, что токен содержит id пользователя
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return undefined;
  }
}

// Регистрация обработчика уведомлений
export function setupNotificationHandler(
  onNotification: (notification: Notification) => void
): void {
  if (!socket) {
    console.warn('Сокет не инициализирован. Вызовите initializeSocket сначала.');
    return;
  }

  socket.on('new_notification', (notification: Notification) => {
    console.log('Получено уведомление:', notification);
    onNotification(notification);
  });
}
