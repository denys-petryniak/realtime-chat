<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <div id="app">
    <AppHeader />
    <div class="container is-max-desktop">
      <RouterView />
    </div>
  </div>
</template>
