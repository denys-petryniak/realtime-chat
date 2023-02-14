<script setup lang="ts">
import type { Chat } from '@/types';

interface Props {
  chat: Chat;
}

defineProps<Props>();
</script>

<template>
  <li class="mb-2 is-size-5 has-text-primary">
    <router-link :to="{ name: 'chat', params: { id: chat.id } }">{{
      chat.id
    }}</router-link>
  </li>
</template>
