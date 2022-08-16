<template>
  <main>
    <h3>Welcome to ChatRoom {{ chatId }}</h3>
    <User>
      <template #user="{ user }">
        <ul v-if="messages.length > 0">
          <li v-for="message of messages" :key="message.key">
            {{ message.text }}
          </li>
        </ul>
        <input v-model="newMessageText" class="input" />
        <button
          :disabled="!newMessageText || loading"
          class="button is-success"
          type="text"
          @click="addMessage(user.uid)"
        >
          Send
        </button>
      </template>
    </User>
  </main>
</template>

<script>
import User from '@/components/User';
import { db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  setDoc,
} from '@firebase/firestore';

export default {
  name: 'ChatRoom',

  data() {
    return {
      newMessageText: '',
      loading: false,
      messages: [],
      unsubscribe: () => {},
    };
  },

  components: {
    User,
  },

  computed: {
    chatId() {
      return this.$route.params.id;
    },
    messagesCollection() {
      return collection(db, 'chats', this.chatId, 'messages');
    },
  },

  created() {
    const targetQuery = query(
      this.messagesCollection,
      orderBy('createdAt'),
      limit(10)
    );

    this.unsubscribe = onSnapshot(targetQuery, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      this.messages = messages;
    });
  },

  beforeDestroy() {
    this.unsubscribe();
  },

  methods: {
    async addMessage(uid) {
      this.loading = true;

      const messagesCollectionDocRef = doc(this.messagesCollection);
      await setDoc(messagesCollectionDocRef, {
        text: this.newMessageText,
        sender: uid,
        createdAt: Date.now(),
      });

      this.loading = false;
      this.newMessageText = '';
    },
  },
};
</script>
