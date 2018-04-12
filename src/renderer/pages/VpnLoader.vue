<template></template>
<script>
  import {mapState} from 'vuex'
  import type from '@/store/types'
  import config from '@/config'
  import messages from '../../app/messages'
  import sleep from '../../libraries/sleep'
  import bugReporter from '../../app/bugReporting/bug-reporting'

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
    async mounted () {
      const {commit, dispatch} = this.$store
      try {
        commit(type.INIT_PENDING)
        const proposalPromise = dispatch(type.PROPOSAL_LIST)
        const identity = await identityGet(this.$store)
        commit(type.IDENTITY_GET_SUCCESS, identity)
        await dispatch(type.IDENTITY_UNLOCK)
        try {
          await proposalPromise
        } catch (err) {
          const isNetworkUnreachable = err.response && err.response.data && err.response.data.message &&
            err.response.data.message.includes('connect: network is unreachable')
          if (!isNetworkUnreachable) {
            commit(type.OVERLAY_ERROR, {message: messages.initializationError.message})
            console.log('Proposal fetching in initialization failed', err)
            bugReporter.renderer.captureException(err)
            return
          }
          commit(type.OVERLAY_ERROR, messages.proposalsConnectionError)
          return
        }
        await proposalPromise
        await dispatch(type.CLIENT_BUILD_INFO)

        await sleep(config.loadingScreenDelay)
        commit(type.INIT_SUCCESS)
        this.$router.push('/vpn')
      } catch (err) {
        commit(type.OVERLAY_ERROR, messages.initializationError)
        bugReporter.renderer.captureException(err)
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
