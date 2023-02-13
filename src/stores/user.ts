import { defineStore } from 'pinia';
import { useCurrentUser } from 'vuefire';

export const useUserStore = defineStore('user', () => {
  const currentUser = useCurrentUser();

  return { currentUser };
});
