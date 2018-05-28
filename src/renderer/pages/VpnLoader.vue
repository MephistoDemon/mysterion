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
  import config from '@/config'
  import messages from '../../app/messages'
  import sleep from '../../libraries/sleep'
  import logger from '../../app/logger'

  export default {
    dependencies: ['bugReporter', 'vpnInitializer'],
    async mounted () {
      const {commit, dispatch} = this.$store
      try {
        this.$store.dispatch(type.LOCATION)
        commit(type.INIT_PENDING)

        const identityState = this.$store.state.identity
        await this.vpnInitializer.initialize(dispatch, commit, identityState)

        await sleep(config.loadingScreenDelay)
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
