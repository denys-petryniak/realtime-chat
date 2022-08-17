<template>
  <main>
    <h3>Welcome to ChatRoom {{ chatId }}</h3>
    <User>
      <template #user="{ user }">
        <ul v-if="messages.length > 0">
          <li v-for="message of messages" :key="message.key">
            <ChatMessage
              :message="message"
              :owner="user.uid === message.sender"
            />
          </li>
        </ul>
        <input v-model="newMessageText" class="input" />
        <hr />
        <h4>Record Audio</h4>
        <button v-if="!recorder" @click="record()">Record</button>
        <button v-else @click="stop()">Stop Record</button>
        <audio v-if="newAudio" :src="newAudioURL" controls></audio>
        <hr />
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
import ChatMessage from '@/components/ChatMessage';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  setDoc,
} from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';

export default {
  name: 'ChatRoom',

  data() {
    return {
      newMessageText: '',
      loading: false,
      messages: [],
      newAudio: null,
      recorder: null,
      unsubscribe: () => {},
    };
  },

  components: {
    User,
    ChatMessage,
  },

  computed: {
    chatId() {
      return this.$route.params.id;
    },
    messagesCollection() {
      return collection(db, 'chats', this.chatId, 'messages');
    },
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
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

      let audioURL = null;

      const messagesCollectionDocRef = doc(this.messagesCollection);

      if (this.newAudio) {
        const storageRef = ref(
          storage,
          `chats/${this.chatId}/${messagesCollectionDocRef.id}.wav`
        );

        await uploadBytes(storageRef, this.newAudio)
          .then(() => {
            return getDownloadURL(
              ref(
                storage,
                `chats/${this.chatId}/${messagesCollectionDocRef.id}.wav`
              )
            );
          })
          .then((url) => {
            audioURL = url;
          })
          .catch((error) => console.error(error));
      }

      await setDoc(messagesCollectionDocRef, {
        text: this.newMessageText,
        sender: uid,
        createdAt: Date.now(),
        audioURL,
      });

      this.loading = false;
      this.newMessageText = '';
      this.newAudio = null;
    },

    async record() {
      this.newAudio = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const options = { mimeType: 'audio/webm' };
      const recordedChunks = [];
      this.recorder = new MediaRecorder(stream, options);

      this.recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener('stop', () => {
        this.newAudio = new Blob(recordedChunks);
        console.log('this.newAudio', this.newAudio);
      });

      this.recorder.start();
    },
    async stop() {
      this.recorder.stop();
      this.recorder = null;
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  padding: 10px;
  border-radius: 0;
}
li {
  display: flex;
}
</style>
