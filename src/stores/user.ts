import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useCurrentUser } from 'vuefire';

export const useUserStore = defineStore('user', () => {
  const currentUser = useCurrentUser();

  const getUserName = computed(
    () =>
      currentUser.value?.displayName ??
      currentUser.value?.email ??
      currentUser.value?.uid
  );

  return { currentUser, getUserName };
});
