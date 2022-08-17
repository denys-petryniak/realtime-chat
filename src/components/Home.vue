<template>
  <div class="section">
    <h3 class="mb-5">Home</h3>
    <hr />
    <User>
      <template v-slot:user="{ user }">
        <template v-if="user">
          <div class="mb-5">
            <h4>User Profile</h4>
            <UserProfile :user="user" />
          </div>
          <hr />
          <div class="mb-5">
            <h4>My Chat Rooms</h4>
            <ChatList :uid="user.uid" />
          </div>
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
