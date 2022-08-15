<template>
  <aside>
    <h3>Sign in Anonymously</h3>
    <button @click="signIn">Sign In</button>
  </aside>
</template>

<script>
import { authAnonymously } from '../firebase.js';

export default {
  name: 'LoginComponent',

  methods: {
    async signIn() {
      try {
        await authAnonymously();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
