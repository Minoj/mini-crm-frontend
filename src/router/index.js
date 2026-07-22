import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const ifAuthorized = (to, from, next) => {
  if (localStorage.getItem('accessToken') !== null) {
    next()
  } else {
    next('/login')
  }
}

const ifNotAuthorized = (to, from, next) => {
  if (localStorage.getItem('accessToken') === null) {
    next()
  } else {
    next('/')
  }
}

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    //beforeEnter: ifAuthorized,
    meta: {
      layout: defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue')),
    },
  },
  {
    path: '/login',
    component: () => import('@/pages/LoginPage.vue'),
    //beforeEnter: ifNotAuthorized,
    meta: {
      layout: defineAsyncComponent(() => import('@/layouts/BlankLayout.vue')),
    },
  },
  {
    path: '/register',
    component: () => import('@/pages/RegisterPage.vue'),
    //beforeEnter: ifNotAuthorized,
    meta: {
      layout: defineAsyncComponent(() => import('@/layouts/BlankLayout.vue')),
    },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
