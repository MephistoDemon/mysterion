<template>
  <div>
    <router-link to="/">loading screen</router-link>
    <b>Connect/Disconnect</b>
    <p>{{currentId}}</p>
    <p>{{proposals}}</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'main',
    computed: {
      ...mapState({
        proposals: state => state.proposal.list,
        currentId: state => state.identity.current
      })
    }
  }
</script>

<style scoped>

</style>