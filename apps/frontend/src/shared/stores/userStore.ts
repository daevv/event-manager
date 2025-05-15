import { defineStore } from 'pinia';
import axiosInstance from '@/shared/utilities/axiosInstance';

export interface User {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  interests: string[];
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      id: 0,
      email: 'examplae@mail.ru',
      firstName: 'Тест',
      secondName: 'Тестович',
      interests: []
    } as unknown as User
  }),

  actions: {
    async initUser(userData: User) {
      this.user = userData;
    },

    async fetchUser(id?: string): Promise<User> {
      const userId = localStorage.getItem('userId');
      try {
        const response = await axiosInstance.get<User>(`/users/${id ?? userId}`);
        await this.initUser(response.data);
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при поиске пользователя');
      }
    },

    async updateUser(updatedFields: Partial<User>) {
      if (!this.user) throw new Error('Пользователь не инициализирован');

      try {
        await axiosInstance.put(`/users/${this.user.id}`, updatedFields);

        // Обновляем локальные данные пользователя
        this.user = { ...this.user, ...updatedFields };
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Ошибка при обновлении пользователя');
      }
    },

    async updatePassword(passwordData: { current: string; new: string; repeat: string }) {
      try {
        await axiosInstance.post('/auth/changePassword', {
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
          repeatPassword: passwordData.repeat
        });
      } catch (error: any) {
        const message = error.response?.data?.message || 'Ошибка при смене пароля';
        alert(message);
      }
    }
  }
});
