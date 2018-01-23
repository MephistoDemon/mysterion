<template></template>
<script>
  import {mapState} from 'vuex'
  import type from '@/store/types'

  async function identityGet ({dispatch}) {
    const identities = await dispatch(type.IDENTITY_LIST)
    if (identities && identities.length !== 0) {
      return identities[0]
    } else {
      const newIdentity = await dispatch(type.IDENTITY_CREATE)
      return newIdentity
    }
  }

  const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

  export default {
    async mounted () {
      const {commit, dispatch} = this.$store

      try {
        commit(type.INIT_PENDING)
        const identityPromise = identityGet(this.$store)
        const proposalPromise = dispatch(type.PROPOSAL_LIST)
        let [identity] = await Promise.all([identityPromise, proposalPromise])
        commit(type.IDENTITY_GET_SUCCESS, identity)
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