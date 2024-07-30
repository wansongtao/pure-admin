import LayoutView from '@/layout/LayoutView.vue'

import type { RouteRecordRaw } from 'vue-router'

export default function getStaticAdminRoute(): RouteRecordRaw {
  return {
    path: '/',
    component: LayoutView,
    name: 'LayoutView',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'index'
        }
      },
      {
        path: 'profile',
        name: 'ProfileView',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          hidden: true,
          cache: true
        }
      }
    ]
  }
}
