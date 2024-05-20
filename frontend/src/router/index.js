import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Profile from '../components/Profile.vue'
import AdminUser from '../components/AdminUser.vue'
import Watches from '../components/Watches.vue'
import AdminWatches from '../components/AdminWatches.vue'
import Cart from '../components/Cart.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      if (store.state.isUserLoggedIn || store.state.isUserAdmin) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart,
    beforeEnter: (to, from, next) => {
      if (store.state.isUserLoggedIn || store.state.isUserAdmin) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  },
  {
    path: '/admin/user',
    name: 'adminUser',
    component: AdminUser,
    beforeEnter: (to, from, next) => {
      if (store.state.isUserLoggedIn && store.state.isUserAdmin) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  },
  {
    path: '/admin/watches',
    name: 'adminWatches',
    component: AdminWatches,
    beforeEnter: (to, from, next) => {
      if (store.state.isUserLoggedIn && store.state.isUserAdmin) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  },
  {
    path: '/watches',
    name: 'watches',
    component: Watches,
    beforeEnter: (to, from, next) => {
      if (store.state.isUserLoggedIn) {
        next()
      } else {
        next({ name: 'home' })
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
