import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

import HomeView from '@/views/HomeView.vue'
import LobbyView from '@/views/LobbyView.vue'
import RoomView from '@/views/RoomView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: LobbyView,
    meta: { requiresAuth: true },
  },
  {
    path: '/room',
    name: 'Room',
    component: RoomView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const { isLogin } = useUserStore()

  if (to.meta.requiresAuth && !isLogin) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
