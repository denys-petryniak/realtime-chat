<script setup lang="ts">
import { useChatsStore } from '@/stores/chats';

import UserContainer from '@/components/UserContainer.vue';
import UserProfile from '@/components/UserProfile.vue';
import ChatList from '@/components/ChatList.vue';

const chatsStore = useChatsStore();
const { chatsCollection, getChats } = chatsStore;
const { chats, loading: isChatsLoading } = getChats();
</script>

<template>
  <div class="section">
    <UserContainer>
      <template v-slot:user="{ user }">
        <template v-if="user">
          <UserProfile :user="user" />
          <hr />
          <div>
            <h3 class="title is-4">My Chat Rooms</h3>
            <template v-if="isChatsLoading">
              <article class="message is-info">
                <div class="message-body">Loading...</div>
              </article>
            </template>
            <template v-else>
              <ChatList
                :chatsCollection="chatsCollection"
                :chats="chats"
                :uid="user.uid"
              />
            </template>
          </div>
        </template>
      </template>
    </UserContainer>
  </div>
</template>
