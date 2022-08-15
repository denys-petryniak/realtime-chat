<template>
  <div>
    <slot name="user" :user="user"></slot>
  </div>
</template>

<script>
export default {
  name: 'UserComponent',
};
</script>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { onAuthStateChangedHandler } from '../firebase';

const user = ref(null);
const unsunscribe = onAuthStateChangedHandler(
  (firebaseUser) => (user.value = firebaseUser)
);

onBeforeUnmount(() => unsunscribe());
</script>
