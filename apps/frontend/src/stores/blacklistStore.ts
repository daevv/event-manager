import { defineStore } from 'pinia';
import axiosInstance from '@/axiosInstance';

export const useBlacklistStore = defineStore('blacklistStore', {
  state: () => ({
    blacklist: [] as any[]
  }),
  actions: {
    async fetchBlacklist() {
      const res = await axiosInstance.get('/blacklists');
      this.blacklist = res.data.map((item) => item.bannedUser);
    },
    async addToBlacklist(email: string) {
      try {
        await axiosInstance.post('/blacklists', { email });
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Ошибка при добавлении в ЧС');
      }
    },
    async removeFromBlacklist(id: number) {
      await axiosInstance.delete(`/blacklists/${id}`);
      this.blacklist = this.blacklist.filter((u) => u.id !== id);
    }
  }
});
