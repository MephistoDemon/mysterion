<!--
  - Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License
  - along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

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

  import AppError from '@/partials/AppError'
  import AppModal from '@/partials/AppModal'
  import RendererMessageBus from '../app/communication/rendererMessageBus'
  import RendererCommunication from '../app/communication/renderer-communication'
  import logger from '../app/logger'

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
      communication.sendRendererBooted()
      communication.onConnectionRequest((proposal) => {
        this.$store.dispatch(type.CONNECT, {
          consumerId: this.$store.getters.currentIdentity,
          providerId: proposal.providerId
        })
      })

      communication.onDisconnectionRequest(() => {
        this.$store.dispatch(type.DISCONNECT)
      })

      communication.onTermsRequest((terms) => {
        this.$store.dispatch(type.TERMS, terms)
        this.$router.push('/terms')
      })

      communication.onMysteriumClientIsReady(() => {
        this.$router.push('/load')
      })

      communication.onTermsAccepted(() => {
        this.$router.push('/')
      })

      communication.onShowRendererError((error) => {
        logger.info('App error received from communication:', event)
        this.$store.dispatch(type.OVERLAY_ERROR, error)
      })

      let previousClientRunningState = true

      communication.onHealthCheck((healthCheckDTO) => {
        const clientRunningState = healthCheckDTO.isRunning
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
