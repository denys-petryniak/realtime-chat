<script setup lang="ts">
import { addDoc } from 'firebase/firestore';
import { useChatsStore } from '@/stores/chats';
import { Constants } from '@/constants';
import type { WithFieldValue } from 'firebase/firestore';
import type { Chat } from '@/types';

import ChatListItem from '@/components/ChatListItem.vue';

const chatsStore = useChatsStore();
const { chatsCollection } = chatsStore;

interface Props {
  ownedChats: Chat[] | null;
  unownedChats: Chat[] | null;
  uid: string;
}

const props = defineProps<Props>();

const createChatRoom = async () => {
  if (
    (props.ownedChats && props.ownedChats.length >= Constants.CHATS_LIMIT) ||
    (props.unownedChats && props.unownedChats.length >= Constants.CHATS_LIMIT)
  ) {
    alert(`Max number of chats is ${Constants.CHATS_LIMIT}`);
    return;
  }

  await addDoc(chatsCollection, {
    createdAt: Date.now(),
    owner: props.uid,
    members: [props.uid],
  } as WithFieldValue<Chat>);
};
</script>

<template>
  <div>
    <h4 class="title is-4">Other chats</h4>
    <template v-if="unownedChats && unownedChats.length > 0">
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
    <template v-if="ownedChats && ownedChats.length > 0">
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
