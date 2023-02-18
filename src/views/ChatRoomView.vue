<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { uploadBytes, getDownloadURL } from '@firebase/storage';
import { useUserStore } from '@/stores/user';
import { useMessagesStore } from '@/stores/messages';
import { useMediaRecorder } from '@/composables/recording';
import { Constants } from '@/constants';
import type { StorageReference } from 'firebase/storage';

import UserContainer from '@/components/UserContainer.vue';
import ChatMessage from '@/components/ChatMessage.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';

const route = useRoute();
const getChatId = computed(() => {
  return route.params.id.toString();
});

const messagesStore = useMessagesStore();
const { getMessages, setNewMessageDoc, getAudioStorageRef } = messagesStore;

const {
  messages,
  loading: isMessagesLoading,
  error: messagesError,
} = getMessages(getChatId.value);

const userStore = useUserStore();
const { getUserName } = userStore;

const { recordingData, startRecording, stopRecording } = useMediaRecorder();

const newMessageText = ref('');
const isMessageLoading = ref(false);

const getCurrentLocation = computed(() => {
  return window.location.href;
});

const newAudioURL = computed(() => {
  return recordingData.value.blob
    ? window.URL.createObjectURL(recordingData.value.blob)
    : undefined;
});

const clearState = () => {
  newMessageText.value = '';
  recordingData.value.blob = null;
  isMessageLoading.value = false;
};

const addMessage = async (uid: string) => {
  if (messages.value.length >= Constants.MESSAGES_limit) {
    clearState();
    alert(`Max number of messages is ${Constants.MESSAGES_limit}`);
    return;
  }

  isMessageLoading.value = true;

  let audioURL = null;

  if (recordingData.value.blob) {
    try {
      const audioStorageRef: StorageReference = getAudioStorageRef(
        getChatId.value
      );

      await uploadBytes(audioStorageRef, recordingData.value.blob);
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
      <h3 class="mr-4 is-size-4">
        Welcome to ChatRoom
        <span class="chat has-text-primary">{{ getChatId }}</span>
      </h3>
      <router-link to="/chats" class="button is-info ml-auto">Back</router-link>
    </div>
    <hr />
    <h4 class="mb-5 pl-4 pr-4 is-size-5 has-text-centered">
      <span> Open this link in another browser window to chat </span>
      <span
        class="link has-text-primary"
        title="Copy to clipboard"
        @click="copyLinkToClipboard"
      >
        {{ getCurrentLocation }}
      </span>
    </h4>
    <UserContainer>
      <template #user="{ user }">
        <div v-if="user" class="box">
          <template v-if="isMessagesLoading">
            <article class="message is-info">
              <div class="message-body">Loading...</div>
            </article>
          </template>
          <template v-else-if="messagesError">
            <article class="message is-info">
              <div class="message-body">{{ messagesError }}</div>
            </article>
          </template>
          <template v-else-if="messages.length">
            <ul class="mb-5">
              <ChatMessage
                v-for="message of messages"
                :key="message.uid"
                :message="message"
                :owner="user.uid === message.uid"
              />
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
                :disabled="
                  (!newMessageText && !recordingData.blob) || isMessageLoading
                "
                class="button is-success"
                @click="addMessage(user.uid)"
              >
                Send
              </button>
              <button
                type="button"
                :class="recordingData.recording ? 'is-danger' : 'is-primary'"
                class="button"
                @click="
                  recordingData.recording ? stopRecording() : startRecording()
                "
              >
                {{ recordingData.recording ? 'Stop' : 'Record' }}
              </button>
            </div>
          </div>
          <div v-if="newAudioURL">
            <AudioPlayer :src="newAudioURL" />
          </div>
          <article v-if="recordingData.error" class="message is-info">
            <div class="message-body">{{ recordingData.error }}</div>
          </article>
        </div>
      </template>
    </UserContainer>
  </main>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
  flex-direction: column;
  padding: 14px;
  margin: 0;
  list-style-type: none;
  border-radius: 0;
}

textarea {
  height: 40px;
  resize: none;
}

.chat {
  word-break: break-all;
}

.link {
  display: inline-block;
  word-break: break-all;
  cursor: pointer;
}
</style>
