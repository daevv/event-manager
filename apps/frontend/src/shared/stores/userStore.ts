import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axiosInstance from '@/shared/utilities/axiosInstance';
import { disconnectSocket, initializeSocket } from '@/shared/services/socket';

export interface User {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  interests: string[];
  favourites: string[];
  isAdmin?: boolean 
}

export const useUserStore = defineStore('userStore', () => {
  // Состояние
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('authToken') || null);

  // Геттеры
  const isAuthenticated = computed<boolean>(() => !!token.value);
  const isAdmin = computed<boolean>(() => !!user.value?.isAdmin);

  // Действия
  async function setAuthData(userData: User, newToken: string) {
    user.value = userData;
    token.value = newToken;
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', String(userData.id));

    // Инициализируем Socket.IO с новым токеном
    disconnectSocket();
    initializeSocket(newToken);
  }

  async function clearAuthData() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Отключаем Socket.IO
    disconnectSocket();
  }

  async function initUser(userData: User) {
    user.value = userData;
    localStorage.setItem('userId', String(userData.id));
  }

  async function fetchUser(id?: string): Promise<User | undefined> {
    const userId = id || localStorage.getItem('userId');
    if (!userId) {
      return;
    }

    try {
      const response = await axiosInstance.get<User>(`/users/user/${userId}`);
      await initUser(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при поиске пользователя');
    }
  }

  async function updateUser(updatedFields: Partial<User>) {
    if (!user.value) {
      throw new Error('Пользователь не инициализирован');
    }

    try {
      await axiosInstance.put(`/users/${user.value.id}`, updatedFields);
      user.value = { ...user.value, ...updatedFields };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении пользователя');
    }
  }

  async function updatePassword(passwordData: { current: string; new: string; repeat: string }) {
    try {
      await axiosInstance.post('/auth/changePassword', {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
        repeatPassword: passwordData.repeat
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка при смене пароля';
      throw new Error(message);
    }
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await axiosInstance.post('/auth/signin', { email, password });
      const { user: userData, token: newToken } = response.data;

      await setAuthData(userData, newToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при входе');
    }
  }

  async function logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      await clearAuthData();
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuthData,
    clearAuthData,
    initUser,
    fetchUser,
    updateUser,
    updatePassword,
    login,
    logout,
    isAdmin
  };
});
