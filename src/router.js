import { createWebHistory, createRouter } from 'vue-router'
import Chat from './pages/Chat.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/sign-up', component: Signup },
  { path: '/chat', component: Chat },
  { path: '/chat/:threadId', component: Chat },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router