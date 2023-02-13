import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCollection, useFirebaseStorage } from 'vuefire';
import {
  collection,
  query,
  doc,
  setDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { ref as storageRef } from '@firebase/storage';
import { db } from '../firebase';
import { Constants } from '../constants';

export const useMessagesStore = defineStore('messages', () => {
  const storage = useFirebaseStorage();

  const getMessagesCollection = (id) => collection(db, 'chats', id, 'messages');

  const getMessagesCollectionDocRef = (id) => doc(getMessagesCollection(id));

  const getMessagesQuery = (id) =>
    query(
      getMessagesCollection(id),
      orderBy('createdAt'),
      limit(Constants.MESSAGES_limit)
    );

  const getMessages = (id) => {
    const {
      // rename the Ref to something more meaningful
      data: messages,
      // is the subscription still pending?
      pending,
      // did the subscription fail?
      error,
      // A promise that resolves or rejects when the initial state is loaded
      promise: messagesPromise,
    } = useCollection(getMessagesQuery(id), {
      wait: true,
    });

    const loading = ref(true);

    messagesPromise.value.then(() => {
      loading.value = false;
    });

    return { messages, loading };
  };

  const getAudioStorageRef = (id) =>
    storageRef(
      storage,
      `chats/${id}/${getMessagesCollectionDocRef(id).id}.wav`
    );

  const setNewMessageDoc = ({ id, text, sender, audioURL, uid }) =>
    setDoc(getMessagesCollectionDocRef(id), {
      createdAt: Date.now(),
      text,
      audioURL,
      sender,
      uid,
    });

  return {
    getMessagesCollectionDocRef,
    getMessages,
    getAudioStorageRef,
    setNewMessageDoc,
  };
});
