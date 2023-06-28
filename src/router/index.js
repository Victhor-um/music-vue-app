import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useUserStore from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/manage-music',
    name: 'manage',
    alias: '/manage',
    component: () => import('@/views/ManageView.vue'),
    // beforeEnter: () => {
    meta: {
      requiresAuth: true
    }
    // }
  },
  // {
  //   path: '/manage',
  //   redirect: { name: 'manage' }
  // },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: () => import('@/views/SongView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const userStore = useUserStore()

  if (userStore.isUserLoggedIn) {
    next()
    return
  } else {
    next({ name: 'home' })
  }
})

export default router
