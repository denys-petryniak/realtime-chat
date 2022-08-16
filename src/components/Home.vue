<template>
  <div>
    <h3>Home</h3>
    <User>
      <template v-slot:user="{ user }">
        <template v-if="user">
          <UserProfile :user="user" />
          <ChatList :uid="user.uid" />
        </template>
        <Login v-else />
      </template>
    </User>
  </div>
</template>

<script>
import Login from '@/components/Login';
import User from '@/components/User';
import UserProfile from '@/components/UserProfile';
import ChatList from '@/components/ChatList';

export default {
  name: 'HomePage',

  components: {
    Login,
    User,
    UserProfile,
    ChatList,
  },
};
</script>
