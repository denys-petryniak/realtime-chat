<template>
  <div>
    <ul v-if="chats.length > 0">
      <li v-for="chat of chats" :key="chat.id">
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">{{
          chat.id
        }}</router-link>
      </li>
    </ul>
    <button @click="createChatRoom()" class="button">
      Create New Chat Room
    </button>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';

export default {
  props: ['uid'],

  data() {
    return {
      chats: [],
      unsubscribe: () => {},
    };
  },

  created() {
    const targetQuery = query(collection(db, 'chats'));

    this.unsubscribe = onSnapshot(targetQuery, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      this.chats = chats;
    });
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  methods: {
    async createChatRoom() {
      const chatsCollection = collection(db, 'chats');

      await addDoc(chatsCollection, {
        createAt: Date.now(),
        owner: this.uid,
        members: [this.uid],
      });
    },
  },
};
</script>
