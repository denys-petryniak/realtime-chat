<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import {
  authAnonymously,
  createUserWithEmailAndPasswordHandler,
  signInWithEmailAndPasswordHandler,
} from '../firebase';

const router = useRouter();
const route = useRoute();

const redirectTo = () => router.push(route.query.redirectTo || '/chats');
// const redirectTo = () => router.push('/chats');

const isNewUser = ref(false);
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const signIn = async () => {
  try {
    await authAnonymously();

    redirectTo();
  } catch (error) {
    console.error(error);
  }
};

const signInOrCreateUser = async () => {
  loading.value = true;
  errorMessage.value = '';

  const user = {
    email: email.value,
    password: password.value,
  };

  try {
    if (isNewUser.value) {
      await createUserWithEmailAndPasswordHandler(user);
    } else {
      await signInWithEmailAndPasswordHandler(user);
    }

    redirectTo();
  } catch (error) {
    errorMessage.value = error.message;
  }

  loading.value = false;
};
</script>

<template>
  <aside class="box">
    <div class="field">
      <h3 class="title is-4 has-text-centered">Sign in Anonymously</h3>
      <div class="buttons is-centered">
        <button class="button is-info" @click="signIn">Sign In</button>
      </div>
    </div>
    <hr />
    <div class="field">
      <h3 class="title is-4 has-text-centered">
        {{ isNewUser ? 'Sign Up for a New Account' : 'Sign In with Email' }}
      </h3>
    </div>
    <div class="field">
      <label for="email" class="label">Email</label>
      <input
        id="email"
        v-model="email"
        placeholder="email"
        type="email"
        class="input"
      />
    </div>
    <div class="field">
      <label for="password" class="label">Password</label>
      <input
        id="password"
        v-model="password"
        placeholder="password"
        type="password"
        class="input"
      />
    </div>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button
          type="button"
          class="button is-primary"
          :class="{ 'is-loading': loading }"
          @click="signInOrCreateUser"
        >
          {{ isNewUser ? 'Sign Up' : 'Login' }}
        </button>
      </p>
      <p class="control">
        <button
          type="button"
          class="button is-info"
          @click="isNewUser = !isNewUser"
        >
          {{ isNewUser ? 'Returning user?' : 'New user?' }}
        </button>
      </p>
    </div>
    <article v-if="errorMessage" class="message is-danger is-small">
      <div class="message-body">
        {{ errorMessage }}
      </div>
    </article>
  </aside>
</template>
