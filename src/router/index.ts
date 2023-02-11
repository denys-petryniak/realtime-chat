import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';

import HomeView from '@/views/HomeView.vue';
import ChatRoomsView from '@/views/ChatRoomsView.vue';
import ChatRoomView from '@/views/ChatRoomView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/chats',
      name: 'chats',
      component: ChatRoomsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: ChatRoomView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  // routes with `meta: { requiresAuth: true }` will check for the users, others won't
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser();
    // if the user is not logged in, redirect to the main page
    if (!currentUser) {
      return {
        path: '/',
        query: {
          // we keep the current path in the query so we can redirect to it after login
          // with `router.push(route.query.redirectTo || '/')`
          redirectTo: to.fullPath,
        },
      };
    }
  }
});

export default router;
