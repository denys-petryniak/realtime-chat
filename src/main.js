import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import { firestorePlugin } from 'vuefire';
import Home from '@/components/Home';
import ChatRoom from '@/components/ChatRoom';

Vue.use(VueRouter);
Vue.use(firestorePlugin);

Vue.config.productionTip = false;

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/chat/:id',
    name: 'chat',
    component: ChatRoom,
  },
];

const router = new VueRouter({
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
