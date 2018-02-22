<template>
    <div id="app" class="app">
        <div id="content">
            <app-nav class="app__nav" v-if="navVisible"/>
            <router-view class="app__page"/>
            <transition name="fade" v-if="visual">
                <app-visual class="app__visual"/>
            </transition>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import type from '@/store/types'
  import AppVisual from '@/partials/AppVisual'
  import AppNav from '@/partials/AppNav'

  import {ipcRenderer} from 'electron'
  import communication from '../libraries/communication'

  export default {
    name: 'App',
    components: {
      AppVisual,
      AppNav
    },
    computed: {
      ...mapGetters(['visual', 'navVisible'])
    },
    async mounted () {
      let previousClientRunningState = true

      // we need to notify the main process that we're up
      ipcRenderer.send(communication.RENDERER_LOADED, true)
      ipcRenderer.on(communication.TERMS_REQUESTED, (event, terms) => {
        this.$store.dispatch(type.TERMS, terms)
        this.$router.push('/terms')
      })

      ipcRenderer.on(communication.APP_START, () => {
        this.$router.push('/load')
      })

      ipcRenderer.on(communication.APP_STATUS, () => {
        this.$router.push('/')
      })

      ipcRenderer.on(communication.APP_ERROR, (event, error) => {
        this.$store.dispatch(type.ERROR_IN_MAIN, error)
        this.$router.push('/')
      })

      ipcRenderer.on(communication.HEALTHCHECK, (event, clientRunningState) => {
        if (previousClientRunningState === clientRunningState) {
          return
        }

        previousClientRunningState = clientRunningState

        // if the client was down, but now up, we need to unlock the identity once again
        if (clientRunningState) {
          this.$router.push('/load')
          return
        }

        this.$store.dispatch(type.ERROR_IN_MAIN, {
          message: 'mysterium_client is down',
          hint: 'Please give it a moment to boot. If this message persists try restarting the app or please contact support'
        })
        this.$router.push('/')
        this.$store.dispatch('setClientRunningState', clientRunningState)
      })
    }
  }
</script>

<style src="@/assets/less/index.less" lang="less"></style>
