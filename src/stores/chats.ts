import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCollection } from 'vuefire';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Constants } from '../constants';

export const useChatsStore = defineStore('chats', () => {
  const chatsCollection = collection(db, 'chats');
  const chatsQuery = query(
    chatsCollection,
    orderBy('createdAt'),
    limit(Constants.CHATS_LIMIT)
  );

  const getChats = () => {
    const {
      // rename the Ref to something more meaningful
      data: chats,
      // is the subscription still pending?
      pending,
      // did the subscription fail?
      error,
      // A promise that resolves or rejects when the initial state is loaded
      promise: chatsPromise,
    } = useCollection(chatsQuery, {
      wait: true,
    });

    const loading = ref(true);

    chatsPromise.value.then(() => {
      loading.value = false;
    });

    return { chats, loading };
  };

  return { chatsCollection, getChats };
});
