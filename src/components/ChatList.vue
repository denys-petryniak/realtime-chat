<script setup lang="ts">
import { addDoc } from 'firebase/firestore';
import { Constants } from '../constants';
import type { Chat } from '../types';

import ChatListItem from '@/components/ChatListItem.vue';

// interface Props {
//   chatsCollection: string;
//   chats: Chat[];
//   uid: string;
// }

// const props = defineProps<Props>();

const props = defineProps([
  'chatsCollection',
  'ownedChats',
  'unownedChats',
  'uid',
]);

const createChatRoom = async () => {
  if (
    props.ownedChats.length >= Constants.CHATS_LIMIT ||
    props.unownedChats.length >= Constants.CHATS_LIMIT
  ) {
    alert(`Max number of chats is ${Constants.CHATS_LIMIT}`);
    return;
  }

  await addDoc(props.chatsCollection, {
    createdAt: Date.now(),
    owner: props.uid,
    members: [props.uid],
  });
};
</script>

<template>
  <div>
    <h4 class="title is-4">Other chats</h4>
    <template v-if="unownedChats.length > 0">
      <ul class="mb-4">
        <ChatListItem
          v-for="chat of unownedChats"
          :key="chat.id"
          :chat="chat"
        />
      </ul>
    </template>
    <template v-else>
      <article class="message is-info">
        <div class="message-body">No chats...</div>
      </article>
    </template>
    <hr />
    <h4 class="title is-4">Owned chats</h4>
    <template v-if="ownedChats.length > 0">
      <ul class="mb-4">
        <ChatListItem v-for="chat of ownedChats" :key="chat.id" :chat="chat" />
      </ul>
    </template>
    <template v-else>
      <article class="message is-info">
        <div class="message-body">No chats...</div>
      </article>
    </template>
    <button type="button" class="button is-info" @click="createChatRoom">
      Create New Chat Room
    </button>
  </div>
</template>
