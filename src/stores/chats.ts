import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCollection, firestoreDefaultConverter } from 'vuefire';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Constants } from '../constants';
import type { Chat } from '../types';

export const useChatsStore = defineStore('chats', () => {
  // const chatsCollection = collection(db, 'chats').withConverter<Chat>({
  //   fromFirestore: (snapshot) => {
  //     const data = firestoreDefaultConverter.fromFirestore(snapshot);
  //     if (!data) return null;
  //     return data;
  //   },
  //   toFirestore: firestoreDefaultConverter.toFirestore,
  // });

  const chatsCollection = collection(db, 'chats');

  const getOwnedChatsQuery = (id) =>
    query(
      chatsCollection,
      where('owner', '==', id),
      orderBy('createdAt'),
      limit(Constants.CHATS_LIMIT)
    );

  const getUnownedChatsQuery = (id) =>
    query(
      chatsCollection,
      where('owner', '!=', id),
      orderBy('owner'),
      orderBy('createdAt'),
      limit(Constants.CHATS_LIMIT)
    );

  const getChats = (id) => {
    const loading = ref(true);
    const error = ref(null);

    const { data: ownedChats, promise: ownedChatsPromise } = useCollection(
      getOwnedChatsQuery(id),
      {
        wait: true,
      }
    );

    const { data: unownedChats, promise: unownedChatsPromise } = useCollection(
      getUnownedChatsQuery(id),
      {
        wait: true,
      }
    );

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
