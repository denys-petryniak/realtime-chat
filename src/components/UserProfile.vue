<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { signOutHandler } from '@/firebase';

const router = useRouter();
const redirectToHome = () => router.push({ path: '/' });

const signOut = async () => {
  try {
    await signOutHandler();

    redirectToHome();
  } catch (error) {
    console.error(error);
  }
};

const userStore = useUserStore();
const { getUserName } = userStore;
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
