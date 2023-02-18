<script setup lang="ts">
import { addDoc } from 'firebase/firestore';
import { useChatsStore } from '@/stores/chats';
import { Constants } from '@/constants';
import type { WithFieldValue } from 'firebase/firestore';
import type { Chat } from '@/types';

import ChatList from '@/components/ChatList.vue';

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
    <ChatList title="Other chats" :chats="unownedChats" />
    <hr />
    <ChatList title="Owned chats" :chats="ownedChats" />
    <button type="button" class="button is-info mt-4" @click="createChatRoom">
      Create New Chat Room
    </button>
  </div>
</template>
