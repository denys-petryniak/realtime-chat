<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { signOutHandler } from '../firebase';

const props = defineProps(['user']);

const router = useRouter();
const route = useRoute();

const redirectTo = () => router.push(route.query.redirectTo || '/');

const signOut = async () => {
  try {
    await signOutHandler();

    redirectTo();
  } catch (error) {
    console.error(error);
  }
};

const getUserName = computed(
  () => props.user.displayName ?? props.user.email ?? props.user.uid
);
</script>

<template>
  <div class="is-flex is-align-items-center">
    <div class="mr-4 is-size-5">
      Logged in as <code class="has-text-primary">{{ getUserName }}</code>
    </div>
    <button type="button" class="ml-auto button is-info" @click="signOut">
      Sign Out
    </button>
  </div>
</template>
