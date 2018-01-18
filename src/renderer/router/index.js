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
      path: '/main',
      name: 'main',
      component: require('@/components/MainScreen/').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
