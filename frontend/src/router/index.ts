import { createRouter, createWebHistory } from 'vue-router';

// TODO: Import views
import HomeView from '../views/HomeView.vue';
import LobbyView from '../views/LobbyView.vue';
import RoomView from '../views/RoomView.vue';
import SettingsView from '../views/SettingsView.vue';
import ProfileView from '../views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/lobby', component: LobbyView },
    { path: '/room/:roomId', component: RoomView },
    { path: '/settings', component: SettingsView },
    { path: '/profile', component: ProfileView }
  ]
});

// TODO: add guard to fetch room state if necessary
export default router;
