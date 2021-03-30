import Vue from 'vue'
import VueRouter from 'vue-router'
import Products from '../views/products.vue'
import Category from '../views/categories.vue'
import Part from '../views/parts.vue'
import Login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'products',
    component: Products,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/categories',
    name: 'category',
    component: Category,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/parts',
    name: 'part',
    component: Part,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  //console.log('abc',from)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('user') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {      
        next()      
    }
  }
  next()
})

export default router
