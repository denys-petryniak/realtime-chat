<script setup lang="ts">
// import { ref, onBeforeUnmount } from 'vue';
import { useCurrentUser } from 'vuefire';
// import { onAuthStateChangedHandler } from '../firebase';

// const user = ref(null);
// const unsunscribe = onAuthStateChangedHandler(
//   (firebaseUser) => (user.value = firebaseUser)
// );

// onBeforeUnmount(() => unsunscribe());

//
const user = useCurrentUser();
// console.log('user', userTest);
</script>

<template>
  <div>
    <slot name="user" :user="user"></slot>
  </div>
</template>
