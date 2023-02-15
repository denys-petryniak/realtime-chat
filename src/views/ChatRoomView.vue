<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { uploadBytes, getDownloadURL } from '@firebase/storage';
import { useUserStore } from '@/stores/user';
import { useMessagesStore } from '@/stores/messages';
import { Constants } from '@/constants';
import type { StorageReference } from 'firebase/storage';

import UserContainer from '@/components/UserContainer.vue';
import ChatMessage from '@/components/ChatMessage.vue';

const route = useRoute();
const getChatId = computed(() => {
  return route.params.id.toString();
});

const messagesStore = useMessagesStore();
const { getMessages, setNewMessageDoc, getAudioStorageRef } = messagesStore;

const { messages, loading: isMessagesLoading } = getMessages(getChatId.value);

const userStore = useUserStore();
const { getUserName } = userStore;

const newMessageText = ref('');
const newAudio = ref<Blob | null>(null);
const recorder = ref<MediaRecorder | null>(null);
const loading = ref(false);

const getCurrentLocation = computed(() => {
  return window.location.href;
});

const newAudioURL = computed(() => {
  return newAudio.value
    ? window.URL.createObjectURL(newAudio.value)
    : undefined;
});

const clearState = () => {
  loading.value = false;
  newMessageText.value = '';
  newAudio.value = null;
};

const addMessage = async (uid: string) => {
  if (messages.value.length >= Constants.MESSAGES_limit) {
    clearState();
    alert(`Max number of messages is ${Constants.MESSAGES_limit}`);
    return;
  }

  loading.value = true;

  let audioURL = null;

  if (newAudio.value) {
    try {
      const audioStorageRef: StorageReference = getAudioStorageRef(
        getChatId.value
      );

      await uploadBytes(audioStorageRef, newAudio.value);
      audioURL = await getDownloadURL(audioStorageRef);
    } catch (error) {
      console.error(error);
    }
  }

  await setNewMessageDoc({
    id: getChatId.value,
    createdAt: Date.now(),
    text: newMessageText.value,
    sender: getUserName,
    audioURL,
    uid,
  });

  clearState();
};

const record = async () => {
  newAudio.value = null;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  const options = { mimeType: 'audio/webm' };
  const recordedChunks: Blob[] = [];
  recorder.value = new MediaRecorder(stream, options);

  recorder.value.addEventListener('dataavailable', (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data as Blob);
    }
  });

  recorder.value.addEventListener('stop', () => {
    newAudio.value = new Blob(recordedChunks);
  });

  recorder.value.start();
};

const stop = async () => {
  recorder.value?.stop();
  recorder.value = null;
};

const copyLinkToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(getCurrentLocation.value);
    alert('Link copied to clipboard');
  } catch (err) {
    alert(`Failed to copy link: ${err}`);
  }
};
</script>

<template>
  <main class="section">
    <div class="is-flex is-align-items-center">
      <div class="is-size-5">
        Welcome to ChatRoom
        <code class="has-text-primary">{{ getChatId }}</code>
      </div>
      <router-link to="/chats" class="button is-info ml-auto">Back</router-link>
    </div>
    <hr />
    <div class="mb-5 pl-6 pr-6">
      <p class="is-size-5 has-text-centered">
        Open this link in another browser window to chat
      </p>
      <p class="is-size-5 has-text-centered">
        <code
          class="code has-text-primary"
          title="Copy to clipboard"
          @click="copyLinkToClipboard"
        >
          {{ getCurrentLocation }}
        </code>
      </p>
    </div>
    <UserContainer>
      <template #user="{ user }">
        <div v-if="user" class="box">
          <template v-if="isMessagesLoading">
            <article class="message is-info">
              <div class="message-body">Loading...</div>
            </article>
          </template>
          <template v-else-if="messages.length">
            <ul class="mb-5">
              <li v-for="message of messages" :key="message.uid" class="mb-2">
                <ChatMessage
                  :message="message"
                  :owner="user.uid === message.uid"
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
          <audio
            v-if="newAudio"
            :src="newAudioURL"
            controls
            class="audio"
          ></audio>
        </div>
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

.code {
  cursor: pointer;
  word-break: break-all;
}

.audio {
  width: 100%;
}
</style>
