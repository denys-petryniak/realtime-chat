import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCollection } from 'vuefire';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Constants } from '../constants';
import type { Chat, ChatsStore } from '../types';

export const useChatsStore = defineStore('chats', (): ChatsStore => {
  const chatsCollection = collection(db, 'chats');

  const getOwnedChatsQuery = (id: string) =>
    query(
      chatsCollection,
      where('owner', '==', id),
      orderBy('createdAt'),
      limit(Constants.CHATS_LIMIT)
    );

  const getUnownedChatsQuery = (id: string) =>
    query(
      chatsCollection,
      where('owner', '!=', id),
      orderBy('owner'),
      orderBy('createdAt'),
      limit(Constants.CHATS_LIMIT)
    );

  const getChats = (id: string) => {
    const loading = ref(true);
    const error = ref<Error | null>(null);

    const { data: ownedChats, promise: ownedChatsPromise } =
      useCollection<Chat>(getOwnedChatsQuery(id), {
        wait: true,
      });

    const { data: unownedChats, promise: unownedChatsPromise } =
      useCollection<Chat>(getUnownedChatsQuery(id), {
        wait: true,
      });

    Promise.all([ownedChatsPromise.value, unownedChatsPromise.value])
      .then(() => {
        loading.value = false;
      })
      .catch((err) => {
        error.value = err;
      });

    return { ownedChats, unownedChats, loading, error };
  };

  return { chatsCollection, getChats };
});
