import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";
import "./style.css";
import vClickOutside from "click-outside-vue3";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vClickOutside)
  .mount('#app')
