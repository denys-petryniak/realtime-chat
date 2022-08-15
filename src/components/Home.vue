<template>
  <div>
    <h3>Home</h3>
    <User>
      <template v-slot:user="{ user }">
        <div v-if="user">Logged-in as {{ user.uid }}</div>
        <Login v-else />
      </template>
    </User>
  </div>
</template>

<script>
import Login from '@/components/Login';
import User from '@/components/User';

export default {
  name: 'HomePage',

  components: {
    Login,
    User,
  },
};
</script>
