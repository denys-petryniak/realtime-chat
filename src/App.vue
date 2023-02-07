<template>
  <div id="app">
    <AppHeader />
    <div class="container is-max-desktop">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<script setup>
import AppHeader from '@/components/AppHeader';
</script>
