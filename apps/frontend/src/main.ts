import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

library.add(faAngleLeft, faAngleRight);

config.styleDefault = 'fas';

const app = createApp(App);

app.use(Toast);

app.use(createPinia());
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app');
