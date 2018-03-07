import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import VpnLoader from '@/pages/VpnLoader'
import AppLoading from '@/pages/AppLoading'
import Vpn from '@/pages/Vpn'
import Terms from '@/pages/Terms'
import About from '@/pages/About'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppLoading,
      meta: {
        visual: 'head',
        navVisible: false
      }
    },
    {
      path: '/load',
      name: 'load',
      meta: {
        visual: 'head'
      },
      component: VpnLoader
    },
    {
      path: '/vpn',
      name: 'vpn',
      meta: {
        visual: 'head'
      },
      component: Vpn
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms,
      meta: {
        navVisible: false
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.getters.loading) {
    store.dispatch(
      'setVisual',
      typeof to.meta.visual !== 'undefined' ? to.meta.visual : null
    )
  }

  store.dispatch('setNavVisibility', typeof to.meta.navVisible !== 'undefined'
    ? (to.meta.navVisible === true)
    : true
  )

  store.dispatch('switchNav', false)
  next()
})

export default router
