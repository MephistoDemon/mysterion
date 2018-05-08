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
  import messages from '../app/communication'

  import AppError from '@/partials/AppError'
  import AppModal from '@/partials/AppModal'
  import RendererMessageBus from '../app/communication/rendererMessageBus'
  import RendererCommunication from '../app/communication/renderer-communication'

  export default {
    name: 'App',
    components: {
      AppVisual,
      AppNav,
      AppError,
      AppModal
    },
    dependencies: ['mysterionReleaseID'],
    computed: {
      ...mapGetters(['navVisible', 'loading', 'visual', 'overlayError', 'clientBuildInfo']),
      version () {
        const clientVisibleVersion = this.clientBuildInfo.buildNumber ? this.clientBuildInfo.buildNumber : ''
        return `v${this.mysterionReleaseID}.${clientVisibleVersion}`
      }
    },
    async mounted () {
      const messageBus = new RendererMessageBus()
      const communication = new RendererCommunication(messageBus)

      // we need to notify the main process that we're up
      communication.sendRendererLoaded()
      communication.onConnectionRequest((proposal) => {
        this.$store.dispatch(type.CONNECT, {
          consumerId: this.$store.getters.currentIdentity,
          providerId: proposal.providerId
        })
      })

      communication.onDisconnectionRequest(() => {
        this.$store.dispatch(type.DISCONNECT)
      })

      messageBus.on(messages.TERMS_REQUESTED, (terms) => {
        this.$store.dispatch(type.TERMS, terms)
        this.$router.push('/terms')
      })

      messageBus.on(messages.APP_START, () => {
        this.$router.push('/load')
      })

      messageBus.on(messages.TERMS_ACCEPTED, () => {
        this.$router.push('/')
      })

      messageBus.on(messages.APP_ERROR, (error) => {
        console.log('APP_ERROR received from ipc:', event)
        this.$store.dispatch(type.OVERLAY_ERROR, error)
      })

      let previousClientRunningState = true

      messageBus.on(messages.HEALTHCHECK, (clientRunningState) => {
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
