<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { currentUser } = userStore;
</script>

<template>
  <slot name="user" :user="currentUser" />
</template>
