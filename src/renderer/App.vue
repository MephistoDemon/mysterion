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
  <div
    id="app"
    class="app">
    <div id="content">
      <div class="control__version">{{ version }}</div>
      <app-modal
        v-if="overlayError"
        :close="false">
        <app-error :error="overlayError"/>
      </app-modal>

      <app-nav
        class="app__nav"
        v-if="navVisible"/>

      <router-view class="app__page"/>

      <transition
        name="fade"
        v-if="visual">
        <app-visual class="app__visual"/>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import type from '@/store/types'
import AppVisual from '@/partials/AppVisual'
import AppNav from '@/partials/AppNav'

import AppError from '@/partials/AppError'
import AppModal from '@/partials/AppModal'
import logger from '../app/logger'
import { getVersionLabel } from '../libraries/version'

export default {
  name: 'App',
  components: {
    AppVisual,
    AppNav,
    AppError,
    AppModal
  },
  dependencies: ['mysterionReleaseID', 'rendererCommunication', 'syncCommunication', 'logger', 'bugReporterMetrics'],
  computed: {
    ...mapGetters(['navVisible', 'loading', 'visual', 'overlayError', 'clientVersion']),
    version () {
      return getVersionLabel(this.mysterionReleaseID, this.clientVersion)
    }
  },
  async mounted () {
    this.bugReporterMetrics.startSyncing(this.rendererCommunication)
    logger.setLogger(this.logger)
    logger.info('App view was mounted')

    // we need to notify the main process that we're up
    this.rendererCommunication.sendRendererBooted()

    this.rendererCommunication.onReconnectRequest(() => {
      this.$store.dispatch(type.RECONNECT)
    })

    this.rendererCommunication.onConnectionRequest((proposal) => {
      this.$store.dispatch(type.CONNECT, {
        consumerId: this.$store.getters.currentIdentity,
        providerId: proposal.providerId
      })
    })

    this.rendererCommunication.onDisconnectionRequest(() => {
      this.$store.dispatch(type.DISCONNECT)
    })

    this.rendererCommunication.onTermsRequest((terms) => {
      this.$store.dispatch(type.TERMS, terms)
      this.$router.push('/terms')
    })

    this.rendererCommunication.onMysteriumClientIsReady(() => {
      this.$router.push('/load')
    })

    this.rendererCommunication.onTermsAccepted(() => {
      this.$router.push('/')
    })

    this.rendererCommunication.onShowRendererError((error) => {
      logger.info('App error received from communication:', error.hint, error.message, 'fatal:', error.fatal)
      this.$store.dispatch(type.OVERLAY_ERROR, error)
    })

    // if the client was down, but now up, we need to unlock the identity once again
    this.rendererCommunication.onMysteriumClientUp(() => {
      this.$store.dispatch('setClientRunningState', true)

      // TODO Such conditional behaviour should be dropped at all
      // do nothing while on terms page
      if (this.$route.name !== 'terms') {
        this.$store.dispatch(type.OVERLAY_ERROR, null)
        this.$router.push('/load')
      }
    })
    this.rendererCommunication.onMysteriumClientDown(() => {
      this.$store.dispatch('setClientRunningState', false)

      // TODO Such conditional behaviour should be dropped at all
      // do nothing while on terms page
      if (this.$route.name !== 'terms') {
        this.$store.dispatch(type.OVERLAY_ERROR, {
          message: 'mysterium_client is down',
          hint: 'Please give it a moment to boot. If this message persists try restarting the app or please contact support'
        })
      }
    })
  }
}
</script>

<style src="@/assets/less/index.less" lang="less"></style>
