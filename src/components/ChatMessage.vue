<script setup lang="ts">
import type { Message } from '@/types';

interface Props {
  message: Message;
  owner: boolean;
}

defineProps<Props>();
</script>

<template>
  <div class="message" :class="{ 'from-user': owner }">
    <div class="mb-3">{{ message.text }}</div>
    <audio
      v-if="message.audioURL"
      :src="message.audioURL"
      controls
      class="mb-3"
    ></audio>
    <div class="sender">from {{ message.sender }}</div>
  </div>
</template>

<style scoped>
.message {
  max-width: 50%;
  width: max-content;
  margin-left: 0;
  margin-right: auto;
  padding: 12px;
  background-color: #efefef;
  color: #131313;
  font-weight: 500;
  border-radius: 8px;
  word-break: break-all;
}

.from-user {
  margin-right: 0;
  margin-left: auto;
  background: #bbd4fd;
}

.sender {
  font-size: 0.5rem;
}
</style>
