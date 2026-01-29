import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/new',
      name: 'new-book',
      component: () => import('../views/FormView.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit-book',
      component: () => import('../views/FormView.vue')
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue')
    }
  ],
})

export default router
