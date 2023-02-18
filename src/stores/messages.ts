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
import type { Message, MessagesStore } from '@/types';

export const useMessagesStore = defineStore('messages', (): MessagesStore => {
  const storage = useFirebaseStorage();

  const getMessagesCollection = (id: string) =>
    collection(db, 'chats', id, 'messages');

  const getMessagesCollectionDocRef = (id: string) =>
    doc(getMessagesCollection(id));

  const getMessagesQuery = (id: string) =>
    query(
      getMessagesCollection(id),
      orderBy('createdAt'),
      limit(Constants.MESSAGES_limit)
    );

  const getMessages = (id: string) => {
    const {
      data: messages,
      promise: messagesPromise,
      error,
    } = useCollection<Message>(getMessagesQuery(id), {
      wait: true,
    });

    const loading = ref(true);

    messagesPromise.value.then(() => {
      loading.value = false;
    });

    return { messages, loading, error };
  };

  const getAudioStorageRef = (id: string) =>
    storageRef(
      storage,
      `chats/${id}/${getMessagesCollectionDocRef(id).id}.mp3`
    );

  const setNewMessageDoc = ({ id, text, sender, audioURL, uid }: Message) =>
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
