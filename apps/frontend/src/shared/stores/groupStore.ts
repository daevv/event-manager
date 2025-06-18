import { defineStore } from 'pinia';
import axiosInstance from '@/shared/utilities/axiosInstance';
import { ref } from 'vue';

// Определение Pinia store для управления группами
export const useGroupStore = defineStore('groupStore', () => {
  const groups = ref<Group[]>([]); // Список групп, изначально пустой массив
  // Получает список групп с сервера
  async function fetchGroups(): Promise<void> {
    try {
      const response = await axiosInstance.get<Group[]>('/groups'); // Запрос списка групп
      groups.value = response.data; // Обновляем состояние
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при получении групп');
    }
  }
  // Создает новую группу
  async function createGroup(name: string): Promise<void> {
    try {
      await axiosInstance.post('/groups', { name }); // Создаем группу
      await fetchGroups(); // Обновляем список групп
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при создании группы');
    }
  }
  // Добавляет участника в группу
  async function addMember(groupId: number, email: string): Promise<void> {
    try {
      await axiosInstance.post(`/groups/${groupId}/members`, { email }); // Добавляем участника
      await fetchGroups(); // Обновляем список групп
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при добавлении участника');
    }
  }
  // Удаляет участника из группы
  async function removeMember(groupId: number, userId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/groups/${groupId}/members/${userId}`); // Удаляем участника
      await fetchGroups(); // Обновляем список групп
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при удалении участника');
    }
  }
  // Удаляет группу
  async function deleteGroup(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/groups/${id}`); // Удаляем группу
      groups.value = groups.value.filter((g) => g.id !== id); // Обновляем локальное состояние
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка при удалении группы');
    }
  }
  return {
    // Возвращаем публичные свойства и методы store
    groups,
    fetchGroups,
    createGroup,
    addMember,
    removeMember,
    deleteGroup
  };
});

export interface Group {
  id: number; // Уникальный идентификатор группы
  name: string; // Название группы
  members?: { id: number; email: string }[]; // Список участников (опционально, зависит от API)
}
