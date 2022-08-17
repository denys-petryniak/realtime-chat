<template>
  <aside class="box">
    <div class="field">
      <h3>Sign in Anonymously</h3>
      <button class="button" @click="signIn">Sign In</button>
    </div>
    <hr />
    <div v-if="newUser" class="field">
      <h3>Sign Up for a New Account</h3>
      <a href="#" @click="newUser = false" class="button">Returning user?</a>
    </div>
    <div v-else class="field">
      <h3>Sign In with Email</h3>
      <a href="#" @click="newUser = true" class="button">New user?</a>
    </div>
    <div class="field">
      <label for="email" class="label">Email</label>
      <input
        v-model="email"
        placeholder="email"
        type="email"
        class="input"
        id="email"
      />
    </div>
    <div class="field">
      <label for="password" class="label">Password</label>
      <input
        v-model="password"
        placeholder="password"
        type="password"
        class="input"
        id="password"
      />
    </div>
    <button
      class="button is-primary"
      :class="{ 'is-loading': loading }"
      @click="signInOrCreateUser"
    >
      {{ newUser ? 'Sign Up' : 'Login' }}
    </button>
    <p class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </aside>
</template>

<script>
import {
  authAnonymously,
  createUserWithEmailAndPasswordHandler,
  signInWithEmailAndPasswordHandler,
} from '../firebase.js';

export default {
  name: 'LoginComponent',

  data() {
    return {
      newUser: false,
      email: '',
      password: '',
      loading: false,
      errorMessage: '',
    };
  },

  methods: {
    async signIn() {
      try {
        await authAnonymously();
      } catch (error) {
        console.error(error);
      }
    },
    async signInOrCreateUser() {
      this.loading = true;
      this.errorMessage = '';

      const user = {
        email: this.email,
        password: this.password,
      };

      try {
        if (this.newUser) {
          await createUserWithEmailAndPasswordHandler(user);
        } else {
          await signInWithEmailAndPasswordHandler(user);
        }
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.loading = false;
    },
  },
};
</script>
