<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
// import UserContainer from '@/components/UserContainer.vue';
// import UserProfile from '@/components/UserProfile.vue';
// import ChatList from '@/components/ChatList.vue';
</script>

<template>
  <div class="section">
    <LoginForm />
    <!--
    <UserContainer>
      <template v-slot:user="{ user }">
        <template v-if="user">
          <UserProfile :user="user" />
          <hr />
          <div>
            <h3 class="title is-4">My Chat Rooms</h3>
            <ChatList :uid="user.uid" />
          </div>
        </template>
        <LoginForm v-else />
      </template>
    </UserContainer> -->
  </div>
</template>
