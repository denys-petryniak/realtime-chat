<script setup lang="ts">
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

interface Props {
  src: string;
}

defineProps<Props>();
</script>

<template>
  <VuePlyr>
    <audio controls playsinline class="player">
      <source :src="src" type="audio/mp3" />
    </audio>
  </VuePlyr>
</template>

<style>
:root {
  --plyr-color-main: #00d1b2;
  --plyr-control-radius: 8px;
}
</style>
