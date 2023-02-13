<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { currentUser } = userStore;
</script>

<template>
  <div>
    <slot name="user" :user="currentUser"></slot>
  </div>
</template>
