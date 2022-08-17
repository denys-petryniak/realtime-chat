<template>
  <div id="app" class="container">
    <header class="section pb-0 has-text-centered">
      <h1 class="title">Vue Voxer</h1>
      <h2 class="subtitle has-text-weight-normal">Realtime Voice Chat</h2>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
