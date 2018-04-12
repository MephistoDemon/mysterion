<template>
    <div id="app" class="app">
        <div id="content">
            <div class="control__version">{{version}}</div>
            <app-modal v-if="overlayError" :close="false">
                <app-error :error="overlayError"></app-error>
            </app-modal>

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

  import {ipcRenderer, remote} from 'electron'
  import communication from '../app/communication'
  import AppError from '@/partials/AppError'
  import AppModal from '@/partials/AppModal'

  export default {
    name: 'App',
    components: {
      AppVisual,
      AppNav,
      AppError,
      AppModal
    },
    computed: {
      ...mapGetters(['navVisible', 'loading', 'visual', 'overlayError', 'clientBuildInfo']),
      version () {
        const mysterionSemanticVersion = remote.getGlobal('__version')
        const mysterionBuildNumber = remote.getGlobal('__buildNumber')
        const mysterionVisibleVersion = `${mysterionSemanticVersion}(${mysterionBuildNumber})`
        const clientVisibleVersion = this.clientBuildInfo.buildNumber ? this.clientBuildInfo.buildNumber : ''
        return `v${mysterionVisibleVersion}.${clientVisibleVersion}`
      }
    },
    async mounted () {
      // we need to notify the main process that we're up
      ipcRenderer.send(communication.RENDERER_LOADED, true)
      ipcRenderer.on(communication.TERMS_REQUESTED, (event, terms) => {
        this.$store.dispatch(type.TERMS, terms)
        this.$router.push('/terms')
      })

      ipcRenderer.on(communication.APP_START, () => {
        this.$router.push('/load')
      })

      ipcRenderer.on(communication.TERMS_ACCEPTED, () => {
        this.$router.push('/')
      })

      ipcRenderer.on(communication.APP_ERROR, (event, error) => {
        console.log('APP_ERROR received from ipc:', event)
        this.$store.dispatch(type.OVERLAY_ERROR, error)
      })

      let previousClientRunningState = true

      ipcRenderer.on(communication.HEALTHCHECK, (event, clientRunningState) => {
        // do nothing while on terms page
        if (this.$route.name === 'terms') {
          return
        }

        if (previousClientRunningState === clientRunningState) {
          return
        }
        previousClientRunningState = clientRunningState

        // if the client was down, but now up, we need to unlock the identity once again
        if (clientRunningState) {
          this.$store.dispatch(type.OVERLAY_ERROR, null)
          this.$router.push('/load')
          return
        }

        this.$store.dispatch(type.OVERLAY_ERROR, {
          message: 'mysterium_client is down',
          hint: 'Please give it a moment to boot. If this message persists try restarting the app or please contact support'
        })
        this.$store.dispatch('setClientRunningState', clientRunningState)
      })
    }
  }
</script>

<style src="@/assets/less/index.less" lang="less"></style>
