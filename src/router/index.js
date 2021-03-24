import Vue from 'vue'
import VueRouter from 'vue-router'
import Products from '../views/products.vue'
import Category from '../views/categories.vue'
import Part from '../views/parts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'products',
    component: Products
  },
  {
    path: '/categories',
    name: 'category',
    component: Category
  },
  {
    path: '/parts',
    name: 'part',
    component: Part
  }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
