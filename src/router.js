import { createWebHistory, createRouter } from 'vue-router'
import Chat from './pages/Chat.vue'

const routes = [
  { path: '/chat', component: Chat },
  { path: '/chat/:threadId', component: Chat },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router