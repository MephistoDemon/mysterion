<template>
  <div>
    <b>Connect/Disconnect</b>
    <p>{{proposals}}</p>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'main',
    computed: {
      ...mapState({
        proposals: state => state.tequilapi.proposals
      }) }
  }
</script>

<style scoped>

</style>