<script setup lang="ts">
import type { Message } from '@/types';

interface Props {
  message: Message;
  owner: boolean;
}

defineProps<Props>();
</script>

<template>
  <li class="message mb-2" :class="{ message_owned: owner }">
    <div class="mb-3">{{ message.text }}</div>
    <audio v-if="message.audioURL" controls class="audio mb-3">
      <source :src="message.audioURL" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
    <div class="sender">from {{ message.sender }}</div>
  </li>
</template>

<style scoped lang="scss">
$screen--sm: 650px;

audio::-webkit-media-controls-panel {
  background-color: #f9f7f7;
}

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
}

.sender {
  font-size: 0.5rem;
}

.audio {
  width: 200px;
}

@media (min-width: $screen--sm) {
  .message {
    max-width: 50%;
  }

  .audio {
    width: 300px;
  }
}
</style>
