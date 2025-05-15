import { defineStore } from 'pinia';
import axiosInstance from '@/shared/utilities/axiosInstance';

export const useGroupStore = defineStore('groupStore', {
  state: () => ({
    groups: [] as any[]
  }),
  actions: {
    async fetchGroups() {
      const res = await axiosInstance.get('/groups');
      this.groups = res.data;
    },
    async createGroup(name: string) {
      await axiosInstance.post('/groups', { name });
      await this.fetchGroups();
    },
    async addMember(groupId: number, email: string) {
      try {
        await axiosInstance.post(`/groups/${groupId}/members`, { email });
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Ошибка при добавлении участника');
      }
    },
    async removeMember(groupId: number, userId: number) {
      await axiosInstance.delete(`groups/${groupId}/members/${userId}`);
      await this.fetchGroups();
    },
    async deleteGroup(id: number) {
      await axiosInstance.delete(`/groups/${id}`);
      this.groups = this.groups.filter((g) => g.id !== id);
    }
  }
});
