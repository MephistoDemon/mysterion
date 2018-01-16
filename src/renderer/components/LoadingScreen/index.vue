<template>
  <div>
    <h1 class="h1">Loading</h1>
    <p>{{initStatus}}</p>
    <p>{{error.message}}</p>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  async function identityGet ({dispatch, commit}) {
    const identities = await dispatch('identityList')
    if (identities.length !== 0) {
      commit('IDENTITY_GET_SUCCESS', identities[0])
      return identities[0]
    } else {
      try {
        const newIdentity = await dispatch('identityCreate')
        return newIdentity
      } catch (err) {
        commit('TEQUILAPI_REQUEST_FAIL', err)
        throw (err)
      }
    }
  }

  export default {
    async mounted () {
      try {
        this.$store.commit('INIT_PENDING')
        const identityPromise = identityGet(this.$store)
        await this.$store.dispatch('proposalList')
        await identityPromise
        this.$store.commit('INIT_SUCCESS')
        this.$router.push('/main')
      } catch (err) {
        this.$store.commit('INIT_FAIL', err)
      }
    },
    computed: mapState({
      initStatus: state => state.tequilapi.init,
      error: state => state.tequilapi.error
    }),
    name: 'loading-screen'
  }
</script>