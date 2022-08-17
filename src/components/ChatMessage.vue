<template>
  <div class="message" :class="{ 'from-user': owner }">
    <div class="mb-3">{{ message.text }}</div>
    <audio
      v-if="message.audioURL"
      :src="message.audioURL"
      controls
      class="mb-3"
    ></audio>
    <div class="sender">from UID {{ message.sender }}</div>
  </div>
</template>

<script>
export default {
  props: ['message', 'owner'],
};
</script>

<style scoped>
.message {
  max-width: 50%;
  width: max-content;
  margin-left: 0;
  margin-right: auto;
  padding: 12px;
  background: #dddddd;
  color: #000;
  border-radius: 6px;
  word-break: break-all;
}

.from-user {
  margin-right: 0;
  margin-left: auto;
  background: #91bbff;
}

.sender {
  font-size: 0.5rem;
}
</style>
