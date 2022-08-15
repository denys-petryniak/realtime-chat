<template>
  <div id="app">
    <header>
      <h1>Vue Voxer</h1>
      <p>Realtime Voice Chat</p>
    </header>
  </div>
</template>

<script>
import { auth } from './firebase';
console.log('auth', auth);

export default {
  name: 'App',
};
</script>
