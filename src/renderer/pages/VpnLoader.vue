<template></template>
<script>
  import {mapState} from 'vuex'
  import type from '@/store/types'
  import config from '@/config'
  import messages from '../../app/messages'
  import sleep from '../../libraries/sleep'

  async function identityGet ({dispatch, commit}) {
    const identities = await dispatch(type.IDENTITY_LIST)
    if (identities && identities.length > 0) {
      return identities[0]
    }

    const newIdentity = await dispatch(type.IDENTITY_CREATE)
    commit(type.INIT_NEW_USER)
    return newIdentity
  }

  export default {
    dependencies: ['bugReporter'],
    async mounted () {
      const {commit, dispatch} = this.$store
      try {
        this.$store.dispatch(type.LOCATION)
        commit(type.INIT_PENDING)
        const identity = await identityGet(this.$store)
        commit(type.IDENTITY_GET_SUCCESS, identity)
        await dispatch(type.IDENTITY_UNLOCK)
        await dispatch(type.CLIENT_BUILD_INFO)

        await sleep(config.loadingScreenDelay)
        commit(type.INIT_SUCCESS)
        this.$router.push('/vpn')
      } catch (err) {
        console.error('Application init failed', err.stack)

        commit(type.INIT_FAIL)
        commit(type.OVERLAY_ERROR, messages.initializationError)
        this.bugReporter.captureException(err)
      }
    },
    computed: {
      ...mapState({
        initStatus: state => state.main.init,
        error: state => state.main.error
      })
    },
    name: 'loading-screen'
  }
</script>
