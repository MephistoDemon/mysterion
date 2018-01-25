<template></template>
<script>
  import {mapState} from 'vuex'
  import type from '@/store/types'

  async function identityGet ({dispatch, commit}) {
    const identities = await dispatch(type.IDENTITY_LIST)
    if (identities && identities.length !== 0) {
      return identities[0]
    } else {
      const newIdentity = await dispatch(type.IDENTITY_CREATE)
      commit(type.INIT_NEW_USER)
      return newIdentity
    }
  }

  const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

  export default {
    async mounted () {
      const {commit, dispatch} = this.$store
      try {
        commit(type.INIT_PENDING)
        const proposalPromise = dispatch(type.PROPOSAL_LIST)
        const identity = await identityGet(this.$store)
        commit(type.IDENTITY_GET_SUCCESS, identity)
        await dispatch(type.IDENTITY_UNLOCK)
        await proposalPromise
        commit(type.INIT_SUCCESS)

        await delay(2000)
        this.$router.push('/main')
      } catch (err) {
        commit(type.INIT_FAIL, err)
        throw (err)
      }
    },
    computed: mapState({
      initStatus: state => state.main.init,
      error: state => state.main.error
    }),
    name: 'loading-screen'
  }
</script>