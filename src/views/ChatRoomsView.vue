<script setup lang="ts">
import { ref } from 'vue';
import { useCollection } from 'vuefire';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

import UserContainer from '@/components/UserContainer.vue';
import UserProfile from '@/components/UserProfile.vue';
import ChatList from '@/components/ChatList.vue';

const chatsCollection = collection(db, 'chats');

const chatsQuery = query(chatsCollection, orderBy('createdAt'), limit(25));

const {
  // rename the Ref to something more meaningful
  data: chats,
  // is the subscription still pending?
  pending,
  // did the subscription fail?
  error,
  // A promise that resolves or rejects when the initial state is loaded
  promise: chatsPromise,
} = useCollection(chatsQuery, {
  wait: true,
});

const isChatsLoading = ref(true);

chatsPromise.value.then(() => {
  isChatsLoading.value = false;
});
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
