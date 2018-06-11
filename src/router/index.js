import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from "../components/PageIndex"
import Search from "../components/PageSearch"
import Block from "../components/PageBlock"
import Validators from "../components/PageValidators"
import Validator from "../components/PageValidator"

const routes = [
  { path: '/', component: Index },
  { path: '/search', component: Search },
  { path: '/block/:block', name: 'block', component: Block },
  { path: '/validators', component: Validators },
  {
    name: 'validator',
    path: '/validators/:validator',
    component: Validator
  }
]

export default new Router({
  mode: 'history',
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
