import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loading-screen',
      component: require('@/components/LoadingScreen/').default
    },
    {
      path: '/info',
      name: 'sysinfo',
      component: require('@/components/LandingPage/SystemInformation').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
