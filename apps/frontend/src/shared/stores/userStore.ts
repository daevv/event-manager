import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axiosInstance from '@/shared/utilities/axiosInstance';
import { disconnectSocket, initializeSocket } from '@/shared/services/socket';

// Интерфейс для структуры данных пользователя
export interface User {
  id: number; // Уникальный идентификатор пользователя
  email: string; // Email пользователя
  firstName: string; // Имя пользователя
  secondName: string; // Фамилия пользователя
  interests: string[]; // Список интересов пользователя
  favourites: string[]; // Список избранных элементов
  isAdmin?: boolean; // Флаг, указывающий, является ли пользователь администратором
}

// Определение Pinia store для управления состоянием пользователя
export const useUserStore = defineStore('userStore', () => {
  // --- Состояние ---
  // Текущее состояние пользователя (может быть null, если пользователь не авторизован)
  const user = ref<User | null>(null);
  // Токен аутентификации, хранится в localStorage и синхронизируется с состоянием
  const token = ref<string | null>(localStorage.getItem('token') || null);

  // --- Геттеры ---
  // Проверяет, авторизован ли пользователь (true, если токен существует)
  const isAuthenticated = computed<boolean>(() => !!token.value);
  // Проверяет, является ли пользователь администратором (true, если isAdmin === true)
  const isAdmin = computed<boolean>(() => !!user.value?.isAdmin);

  // --- Действия ---
  /**
   * Устанавливает данные аутентификации (пользователь и токен)
   * @param userData Данные пользователя
   * @param newToken Токен аутентификации
   */
  async function setAuthData(userData: User, newToken: string) {
    user.value = userData; // Обновляем данные пользователя
    token.value = newToken; // Обновляем токен
    localStorage.setItem('token', newToken); // Сохраняем токен в localStorage
    localStorage.setItem('userId', String(userData.id)); // Сохраняем ID пользователя

    // Переподключаем Socket.IO с новым токеном
    disconnectSocket(); // Отключаем существующее соединение
    initializeSocket(newToken); // Инициализируем новое соединение
  }

  /**
   * Очищает данные аутентификации при выходе из системы
   */
  async function clearAuthData() {
    user.value = null; // Сбрасываем данные пользователя
    token.value = null; // Сбрасываем токен
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    localStorage.removeItem('userId'); // Удаляем ID пользователя

    // Отключаем Socket.IO соединение
    disconnectSocket();
  }

  /**
   * Инициализирует данные пользователя
   * @param userData Данные пользователя
   */
  async function initUser(userData: User) {
    user.value = userData; // Устанавливаем данные пользователя
    localStorage.setItem('userId', String(userData.id)); // Сохраняем ID
  }

  /**
   * Запрашивает данные пользователя по ID
   * @param id ID пользователя (если не указан, берется из localStorage)
   * @returns Данные пользователя или undefined, если пользователь не найден
   * @throws Ошибка с сообщением от сервера или дефолтное сообщение
   */
  async function fetchUser(id?: string): Promise<User | undefined> {
    const userId = id || localStorage.getItem('userId'); // Используем переданный ID или из localStorage
    if (!userId) {
      return; // Если ID отсутствует, возвращаем undefined
    }

    try {
      const response = await axiosInstance.get<User>(`/users/user/${userId}`); // Запрос данных пользователя
      await initUser(response.data); // Инициализируем пользователя
      return response.data; // Возвращаем данные
    } catch (error: any) {
      // Бросаем ошибку с сообщением от сервера или дефолтным текстом
      throw new Error(error.response?.data?.message || 'Ошибка при поиске пользователя');
    }
  }

  /**
   * Обновляет данные пользователя
   * @param updatedFields Обновленные поля пользователя
   * @throws Ошибка, если пользователь не инициализирован или сервер вернул ошибку
   */
  async function updateUser(updatedFields: Partial<User>) {
    if (!user.value) {
      throw new Error('Пользователь не инициализирован'); // Проверяем наличие пользователя
    }

    try {
      await axiosInstance.put(`/users/${user.value.id}`, updatedFields); // Отправляем обновленные данные
      user.value = { ...user.value, ...updatedFields }; // Обновляем локальное состояние
    } catch (error: any) {
      // Бросаем ошибку с сообщением от сервера или дефолтным текстом
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении пользователя');
    }
  }

  /**
   * Обновляет пароль пользователя
   * @param passwordData Объект с текущим, новым и повторенным паролем
   * @throws Ошибка с сообщением от сервера или дефолтное сообщение
   */
  async function updatePassword(passwordData: { current: string; new: string; repeat: string }) {
    try {
      await axiosInstance.post('/auth/changePassword', {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
        repeatPassword: passwordData.repeat
      }); // Отправляем запрос на смену пароля
    } catch (error: any) {
      // Бросаем ошибку с сообщением от сервера или дефолтным текстом
      const message = error.response?.data?.message || 'Ошибка при смене пароля';
      throw new Error(message);
    }
  }

  /**
   * Выполняет вход пользователя
   * @param email Email пользователя
   * @param password Пароль пользователя
   * @throws Ошибка с сообщением от сервера или дефолтное сообщение
   */
  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await axiosInstance.post('/auth/signin', { email, password }); // Запрос на вход
      const { user: userData, token: newToken } = response.data; // Извлекаем данные и токен
      await setAuthData(userData, newToken); // Устанавливаем данные аутентификации
    } catch (error: any) {
      // Бросаем ошибку с сообщением от сервера или дефолтным текстом
      throw new Error(error.response?.data?.message || 'Ошибка при входе');
    }
  }

  /**
   * Выполняет выход пользователя
   * @throws Ошибка при выполнении запроса на выход (не влияет на очистку данных)
   */
  async function logout(): Promise<void> {
    try {
      await clearAuthData();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  }

  // Возвращаем публичные свойства и методы store
  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setAuthData,
    clearAuthData,
    initUser,
    fetchUser,
    updateUser,
    updatePassword,
    login,
    logout
  };
});
