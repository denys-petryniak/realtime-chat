<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import {
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
} from '@firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from '@firebase/storage';
import { useCollection, useFirebaseStorage } from 'vuefire';
import { db } from '../firebase';

import UserContainer from '@/components/UserContainer.vue';
import ChatMessage from '@/components/ChatMessage.vue';
// import LoginForm from '@/components/LoginForm.vue';

const storage = useFirebaseStorage();

const route = useRoute();

const newMessageText = ref('');
const newAudio = ref(null);
const recorder = ref(null);
const loading = ref(false);

const getCurrentLocation = computed(() => {
  return window.location.href;
});

const chatId = computed(() => {
  return route.params.id;
});

const messagesCollection = collection(db, 'chats', chatId.value, 'messages');

const messagesQuery = query(
  messagesCollection,
  orderBy('createdAt'),
  limit(100)
);

const {
  // rename the Ref to something more meaningful
  data: messages,
  // is the subscription still pending?
  pending,
  // did the subscription fail?
  error,
  // A promise that resolves or rejects when the initial state is loaded
  promise: messagesPromise,
} = useCollection(messagesQuery, {
  wait: true,
});

const isMessagesLoading = ref(true);

messagesPromise.value.then(() => {
  isMessagesLoading.value = false;
});

const newAudioURL = computed(() => {
  return URL.createObjectURL(newAudio.value);
});

const addMessage = async (uid) => {
  loading.value = true;

  let audioURL = null;

  const messagesCollectionDocRef = doc(messagesCollection);

  if (newAudio.value) {
    const audioStorageRef = storageRef(
      storage,
      `chats/${chatId.value}/${messagesCollectionDocRef.id}.wav`
    );

    try {
      await uploadBytes(audioStorageRef, newAudio.value);
      const url = await getDownloadURL(audioStorageRef);

      audioURL = url;
    } catch (error) {
      console.error(error);
    }
  }

  await setDoc(messagesCollectionDocRef, {
    text: newMessageText.value,
    sender: uid,
    createdAt: Date.now(),
    audioURL,
  });

  loading.value = false;
  newMessageText.value = '';
  newAudio.value = null;
};

const record = async () => {
  newAudio.value = null;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  const options = { mimeType: 'audio/webm' };
  const recordedChunks = [];
  recorder.value = new MediaRecorder(stream, options);

  recorder.value.addEventListener('dataavailable', (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  });

  recorder.value.addEventListener('stop', () => {
    newAudio.value = new Blob(recordedChunks);
  });

  recorder.value.start();
};

const stop = async () => {
  console.log('newAudio.value', newAudio.value);

  recorder.value.stop();
  recorder.value = null;
};
</script>

<template>
  <main class="section">
    <div class="is-flex is-align-items-center">
      <div class="is-size-5">
        Welcome to ChatRoom <code class="has-text-primary">{{ chatId }}</code>
      </div>
      <router-link to="/chats" class="button is-info ml-auto">Back</router-link>
    </div>
    <hr />
    <p class="mb-5 is-size-5 has-text-centered">
      Open this link in another browser window to chat
      <code class="has-text-primary">{{ getCurrentLocation }}</code>
    </p>
    <UserContainer>
      <template #user="{ user }">
        <template v-if="user">
          <template v-if="isMessagesLoading">
            <article class="message is-info">
              <div class="message-body">Loading...</div>
            </article>
          </template>
          <template v-else-if="messages.length">
            {{ isMessagesLoading }}
            <ul class="mb-5 has-background-white-ter">
              <li v-for="message of messages" :key="message.key" class="mb-2">
                <ChatMessage
                  :message="message"
                  :owner="user.uid === message.sender"
                />
              </li>
            </ul>
          </template>
          <template v-else>
            <article class="message is-info">
              <div class="message-body">No messages...</div>
            </article>
          </template>
          <div class="is-flex mb-4">
            <textarea
              v-model="newMessageText"
              class="input mr-4"
              placeholder="Message"
              @keyup.enter="addMessage(user.uid)"
            ></textarea>
            <div class="buttons is-flex-wrap-nowrap">
              <button
                type="button"
                :disabled="(!newMessageText && !newAudio) || loading"
                class="button is-success"
                @click="addMessage(user.uid)"
              >
                Send
              </button>
              <button
                type="button"
                :class="recorder ? 'is-danger' : 'is-primary'"
                class="button"
                @click="recorder ? stop() : record()"
              >
                {{ recorder ? 'Stop' : 'Record' }}
              </button>
            </div>
          </div>
          <audio v-if="newAudio" :src="newAudioURL" controls></audio>
        </template>
        <!-- <LoginForm v-else /> -->
      </template>
    </UserContainer>
  </main>
</template>

<style scoped>
ul {
  display: flex;
  flex-direction: column;
  min-width: 500px;
  padding: 16px;
  list-style-type: none;
  margin: 0;
  border-radius: 0;
}

textarea {
  height: 40px;
  resize: none;
}
</style>
