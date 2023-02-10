<script setup lang="ts">
import { useCollection } from 'vuefire';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const props = defineProps(['uid']);

const chats = useCollection(collection(db, 'chats'));

const createChatRoom = async () => {
  const chatsCollection = collection(db, 'chats');

  await addDoc(chatsCollection, {
    createAt: Date.now(),
    owner: props.uid,
    members: [props.uid],
  });
};
</script>

<template>
  <div>
    <ul v-if="chats.length > 0" class="mb-4">
      <li
        v-for="chat of chats"
        :key="chat.id"
        class="mb-2 is-size-5 has-text-primary"
      >
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">{{
          chat.id
        }}</router-link>
      </li>
    </ul>
    <button type="button" @click="createChatRoom()" class="button is-info">
      Create New Chat Room
    </button>
  </div>
</template>
