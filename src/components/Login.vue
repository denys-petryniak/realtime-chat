<template>
  <aside class="box">
    <div class="field">
      <h3 class="has-text-centered">Sign in Anonymously</h3>
      <div class="buttons is-centered">
        <button class="button" @click="signIn">Sign In</button>
      </div>
    </div>
    <hr />
    <div class="field">
      <h3 class="has-text-centered">
        {{ newUser ? 'Sign Up for a New Account' : 'Sign In with Email' }}
      </h3>
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
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button
          type="button"
          class="button is-primary"
          :class="{ 'is-loading': loading }"
          @click="signInOrCreateUser"
        >
          {{ newUser ? 'Sign Up' : 'Login' }}
        </button>
      </p>
      <p class="control">
        <button type="button" class="button" @click="newUser = !newUser">
          {{ newUser ? 'Returning user?' : 'New user?' }}
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
