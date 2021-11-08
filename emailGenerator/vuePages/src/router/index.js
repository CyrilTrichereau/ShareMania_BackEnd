import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ConfirmInscription',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ConfirmInscription.vue')
  },
  // {
  //   path: '/ResetYourPassword',
  //   name: 'ResetYourPassword',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ResetYourPassword.vue')
  // },
  // {
  //   path: '/ConfirmNewPassword',
  //   name: 'ConfirmNewPassword',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ConfirmNewPassword.vue')
  // },
  // {
  //   path: '/ConfirmChanges',
  //   name: 'ConfirmChanges',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ConfirmChanges.vue')
  // },
  // {
  //   path: '/ConfirmEraseProfile',
  //   name: 'ConfirmEraseProfile',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ConfirmEraseProfile.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
