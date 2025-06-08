import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/app/App.vue';
import router from '@/shared/router';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Toast, { POSITION, useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { initializeSocket, setupNotificationHandler } from '@/shared/services/socket';
import { useUserStore } from '@/shared/stores/userStore';

library.add(faAngleLeft, faAngleRight);

config.styleDefault = 'fas';

const app = createApp(App);

app.use(Toast);

app.use(createPinia());
app.use(router);

const authStore = useUserStore();
const token = authStore.token || localStorage.getItem('authToken');
const toast = useToast();

if (token) {
  initializeSocket(token);
  // Настройка уведомлений
  setupNotificationHandler((notification) => {
    console.log(notification);
    toast.success(notification.content, {
      timeout: 5000,
      position: POSITION.TOP_RIGHT
    });
  });
}

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app');
