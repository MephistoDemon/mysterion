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

<template></template>
<script>
  import {mapState} from 'vuex'
  import type from '@/store/types'
  import messages from '../../app/messages'
  import logger from '../../app/logger'
  import DelayedRetrier from '../../app/delayedRetrier'

  export default {
    dependencies: ['bugReporter', 'vpnInitializer', 'sleeper'],
    async mounted () {
      const {commit, dispatch} = this.$store
      try {
        this.$store.dispatch(type.LOCATION)
        commit(type.INIT_PENDING)

        const identityState = this.$store.state.identity
        const initialize = async () => this.vpnInitializer.initialize(dispatch, commit, identityState)
        const delay = async () => {
          const msg = 'Initialization failed, will retry.'
          logger.info(msg)
          this.bugReporter.captureInfoMessage(msg)
          await this.sleeper.sleep(3000)
        }
        const initializeRetrier = new DelayedRetrier(initialize, delay, 3)
        await initializeRetrier.retryWithDelay()

        commit(type.INIT_SUCCESS)
        this.$router.push('/vpn')
      } catch (err) {
        logger.error('Application init failed', err.stack)

        commit(type.INIT_FAIL)
        commit(type.OVERLAY_ERROR, messages.initializationError)
        this.bugReporter.captureException(err)
      }
    },
    computed: {
      ...mapState({
        error: state => state.main.error
      })
    },
    name: 'loading-screen'
  }
</script>
