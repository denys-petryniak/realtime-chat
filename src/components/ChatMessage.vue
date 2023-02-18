<script setup lang="ts">
import type { Message } from '@/types';

import AudioPlayer from '@/components/AudioPlayer.vue';

interface Props {
  message: Message;
  owner: boolean;
}

defineProps<Props>();
</script>

<template>
  <li class="message mb-2" :class="{ message_owned: owner }">
    <div class="mb-3">{{ message.text }}</div>
    <AudioPlayer v-if="message.audioURL" :src="message.audioURL" />
    <div class="sender">from {{ message.sender }}</div>
  </li>
</template>

<style scoped lang="scss">
$screen--sm: 650px;

.message {
  margin-left: 0;
  margin-right: auto;
  padding: 12px;
  background-color: #efefef;
  color: #131313;
  font-weight: 500;
  border-radius: 8px;
  word-break: break-all;

  &_owned {
    margin-right: 0;
    margin-left: auto;
    background-color: #bbd4fd;
  }

  ::v-deep(.plyr) {
    margin-bottom: 12px;
  }
}

.sender {
  font-size: 0.5rem;
}

@media (min-width: $screen--sm) {
  .message {
    max-width: 50%;
  }
}
</style>
