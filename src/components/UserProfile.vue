<template>
  <div>
    <div class="mb-2">Logged in as {{ user.uid }}</div>
    <button @click="signOut" class="button">Sign Out</button>
  </div>
</template>

<script>
import { signOutHandler } from '../firebase';

export default {
  props: ['user'],

  methods: {
    async signOut() {
      try {
        await signOutHandler();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
