import { createApp } from 'vue'
import { router } from './app/router'
import App from './app/App.vue'
import './style.css'

createApp(App).use(router).mount('#app')
