<template>
  <div>
    <button @click="createChatRoom()">Create New Chat Room</button>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default {
  props: ['uid'],

  methods: {
    async createChatRoom() {
      const chatsCollection = collection(db, 'chats');

      const newChat = await addDoc(chatsCollection, {
        createAt: Date.now(),
        owner: this.uid,
        members: [this.uid],
      });

      console.log('newChat', newChat);
    },
  },
};
</script>
