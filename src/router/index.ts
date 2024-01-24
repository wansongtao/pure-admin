import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/views/NotFound.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        title: '登录',
        hidden: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: {
        title: '404',
        hidden: true
      }
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash
      }
    }

    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router
