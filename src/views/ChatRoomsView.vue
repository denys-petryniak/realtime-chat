<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useChatsStore } from '@/stores/chats';

import UserContainer from '@/components/UserContainer.vue';
import UserProfile from '@/components/UserProfile.vue';
import ChatContainer from '@/components/ChatsContainer.vue';

const userStore = useUserStore();
const { currentUser } = userStore;

const chatsStore = useChatsStore();
const { getChats } = chatsStore;
const { ownedChats, unownedChats, loading, error } = getChats(currentUser?.uid);
</script>

<template>
  <div class="section">
    <UserContainer>
      <template #user="{ user }">
        <template v-if="user">
          <UserProfile :user="user" />
          <hr />
          <div>
            <h3 class="title is-3 has-text-centered">Chat Rooms</h3>
            <template v-if="loading">
              <article class="message is-info">
                <div class="message-body">Loading...</div>
              </article>
            </template>
            <template v-else-if="error">
              <article class="message is-info">
                <div class="message-body">Error: {{ error.message }}</div>
              </article>
            </template>
            <template v-else>
              <ChatContainer
                :owned-chats="ownedChats"
                :unowned-chats="unownedChats"
                :uid="user.uid"
              />
            </template>
          </div>
        </template>
      </template>
    </UserContainer>
  </div>
</template>
