<script setup lang="ts">
import { addDoc } from 'firebase/firestore';

const props = defineProps(['chatsCollection', 'chats', 'uid']);

const createChatRoom = async () => {
  await addDoc(props.chatsCollection, {
    createdAt: Date.now(),
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
