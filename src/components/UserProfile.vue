<template>
  <div>
    Logged in as {{ user.uid }}
    <button @click="signOut">Sign Out</button>
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
