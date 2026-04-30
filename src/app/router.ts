import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../pages/main/MainPage.vue'
import ListPage from '../pages/list/ListPage.vue'
import LogPage from '../pages/log/LogPage.vue'
import StatsPage from '../pages/stats/StatsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MainPage },
    { path: '/list', component: ListPage },
    { path: '/log', component: LogPage },
    { path: '/stats', component: StatsPage },
  ],
})
