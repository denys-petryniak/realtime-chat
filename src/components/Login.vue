<template>
  <aside class="section">
    <h3>Sign in Anonymously</h3>
    <button class="button" @click="signIn">Sign In</button>
    <div v-if="newUser">
      <h3>Sign Up for a New Account</h3>
      <a href="#" @click="newUser = false">Returning user?</a>
    </div>
    <div v-else>
      <h3>Sign In with Email</h3>
      <a href="#" @click="newUser = true">New user?</a>
    </div>
    <label for="email">Email</label><br />
    <input
      v-model="email"
      placeholder="email"
      type="email"
      class="input"
      id="email"
    />
    <label for="password">Password</label><br />
    <input
      v-model="password"
      placeholder="password"
      type="password"
      class="input"
      id="password"
    />
    <button
      class="button is-info"
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
