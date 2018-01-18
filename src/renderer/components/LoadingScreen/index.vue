<template>
  <div>
    <h1 class="h1">Loading</h1>
    <p class="status">{{initStatus}}</p>
    <p>{{error.message}}</p>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  async function identityGet ({dispatch}) {
    const identities = await dispatch('identityList')
    if (identities && identities.length !== 0) {
      return identities[0]
    } else {
      const newIdentity = await dispatch('identityCreate')
      return newIdentity
    }
  }

  export default {
    async mounted () {
      const {commit, dispatch} = this.$store
      try {
        commit('INIT_PENDING')
        const identityPromise = identityGet(this.$store)
        const proposalPromise = dispatch('proposalList')
        let [identity] = await Promise.all([identityPromise, proposalPromise])
        commit('IDENTITY_GET_SUCCESS', identity)
        console.log(await dispatch('healthcheck'))
        commit('INIT_SUCCESS')
        this.$router.push('/main')
      } catch (err) {
        commit('INIT_FAIL', err)
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