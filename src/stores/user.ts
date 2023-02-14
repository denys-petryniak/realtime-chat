import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useCurrentUser } from 'vuefire';
import type { UserStore } from '@/types';

export const useUserStore = defineStore('user', (): UserStore => {
  const currentUser = useCurrentUser();

  const getUserName = computed(
    () =>
      currentUser.value?.displayName ??
      currentUser.value?.email ??
      currentUser.value?.uid
  );

  return { currentUser, getUserName };
});
