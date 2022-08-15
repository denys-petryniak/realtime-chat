<template>
  <div>
    <h3>Home</h3>
    <Login />
  </div>
</template>

<script>
import Login from '@/components/Login';

export default {
  name: 'HomePage',

  components: {
    Login,
  },
};
</script>
