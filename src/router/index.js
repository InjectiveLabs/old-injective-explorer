import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

import Index from "../components/PageIndex"
import Search from "../components/PageSearch"
import Block from "../components/PageBlock"
import FullNodes from "../components/PageFullNodes"
import FullNode from "../components/PageFullNode"
import PageValidators from "../components/PageValidators"
import PageValidatorsIndex from "../components/PageValidatorsIndex"
import PageValidatorsRevoked from "../components/PageValidatorsRevoked"
import PageValidator from "../components/PageValidator"

const routes = [
  { path: "/", component: Index },
  { path: "/search", component: Search },
  { path: "/blocks/:block", name: "block", component: Block },
  { path: "/nodes", component: FullNodes },
  {
    name: "node",
    path: "/nodes/:node",
    component: FullNode
  },

  // VALIDATORS
  {
    path: "/validators",
    component: PageValidators,
    children: [
      {
        path: "/",
        name: "validators",
        component: PageValidatorsIndex
      },
      {
        path: ":validator",
        name: "validator",
        component: PageValidator
      }
    ]
  },

  // REVOKED
  {
    path: "/validators-revoked",
    name: "validators-revoked",
    component: PageValidatorsRevoked
  }
]

export default new Router({
  mode: "history",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
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
