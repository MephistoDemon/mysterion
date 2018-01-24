<template>
  <div class="aligner">
    <div class="aligner-item">
      <div>
        <img src="~@/assets/head.png" />
        <h1 class="h4">Loading</h1>
        <p class="status">{{initStatus}}</p>

        <div v-if="error.message">
          <p v-if="error.message">{{error.message}}</p>
          <p v-if="error.response">{{error.response.data}}</p>

          <div v-if="error.config">
            <p>{{error.config.method}}</p>
            <p>{{error.config.url}}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

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

<style lang="scss" scoped>
  .aligner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }
  .aligner-item {
    flex: 1;
  }
  .aligner-item--fixed {
    flex: none;
    max-width: 50%;
  }
</style>