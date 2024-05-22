import { createApp } from 'vue'
import { createPinia } from 'pinia';

import './style.css'
import App from './App.vue'
import router from './router';
import Vue3Lottie from 'vue3-lottie';


createApp(App)
    .use(router)
    .use(createPinia())
    .use(Vue3Lottie)
    .mount('#app')
