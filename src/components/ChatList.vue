<script setup lang="ts">
import type { Chat } from '@/types';
import ChatListItem from '@/components/ChatListItem.vue';

interface Props {
  title: string;
  chats: Chat[] | null;
}

defineProps<Props>();
</script>

<template>
  <div>
    <h4 class="title is-4">{{ title }}</h4>
    <template v-if="chats && chats.length > 0">
      <ul>
        <ChatListItem v-for="chat of chats" :key="chat.id" :chat="chat" />
      </ul>
    </template>
    <template v-else>
      <article class="message is-info">
        <div class="message-body">No chats...</div>
      </article>
    </template>
  </div>
</template>
