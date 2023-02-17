<script setup lang="ts">
interface Props {
  src: string | undefined;
}

defineProps<Props>();
</script>

<template>
  <audio controls>
    <source :src="src" type="audio/mp3" />
    Your browser does not support the audio element.
  </audio>
</template>

<style scoped>
audio::-webkit-media-controls-panel {
  background-color: #f9f7f7;
}
</style>
