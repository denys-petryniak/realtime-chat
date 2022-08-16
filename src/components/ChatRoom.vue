<template>
  <main>
    <h3>Welcome to ChatRoom {{ chatId }}</h3>
  </main>
</template>

<script>
export default {
  computed: {
    chatId() {
      return this.$route.params.id;
    },
  },
};
</script>
