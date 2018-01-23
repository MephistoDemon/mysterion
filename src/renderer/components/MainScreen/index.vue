<template>
  <div>
    <router-link to="/">loading screen</router-link>
    <button v-on:click="unlock()">unlock</button>
    <button v-on:click="createNewId()">creante new</button>
    <b>Connect/Disconnect</b>
    <p>{{currentId}}</p>
    <p>{{proposals}}</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import type from '../../store/types'

  export default {
    name: 'main',
    computed: {
      ...mapState({
        proposals: state => state.proposal.list,
        currentId: state => state.identity.current
      })
    },
    methods: {
      unlock () { this.$store.dispatch(type.IDENTITY_UNLOCK) },
      createNewId () { this.$store.dispatch(type.IDENTITY_CREATE) }
    }
  }
</script>

<style scoped>

</style>