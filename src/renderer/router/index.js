import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Loading from '@/pages/Loading'
import Main from '@/pages/Main'
import About from '@/pages/About'
import Technology from '@/pages/Technology'
import Share from '@/pages/Share'
import TutorialDecentralized from '@/pages/tutorial/TutorialDecentralized'
import TutorialDecentralized2 from '@/pages/tutorial/TutorialDecentralized2'
import TutorialDecentralized3 from '@/pages/tutorial/TutorialDecentralized3'
import TutorialDecentralized4 from '@/pages/tutorial/TutorialDecentralized4'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'loading',
      meta: {
        visual: 'head'
      },
      component: Loading
    },
    {
      path: '/main',
      name: 'main',
      meta: {
        visual: 'head'
      },
      component: Main
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/technology',
      name: 'technology',
      component: Technology
    },
    {
      path: '/share',
      name: 'Share',
      component: Share
    },
    {
      path: '/tutorial/decentralized',
      name: 'tutorial',
      meta: {
        visual: 'networking'
      },
      component: TutorialDecentralized
    },
    {
      path: '/tutorial/decentralized2',
      name: 'tutorial2',
      meta: {
        visual: 'cube'
      },
      component: TutorialDecentralized2
    },
    {
      path: '/tutorial/decentralized3',
      name: 'tutorial3',
      meta: {
        visual: 'eye'
      },
      component: TutorialDecentralized3
    },
    {
      path: '/tutorial/decentralized4',
      name: 'tutorial4',
      meta: {
        visual: 'quit'
      },
      component: TutorialDecentralized4
    },
    {
      path: '*',
      redirect: '/'
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
  store.dispatch('switchNav', false)
  next()
})

export default router
