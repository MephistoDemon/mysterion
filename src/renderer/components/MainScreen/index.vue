<template>
  <div>
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
        proposals: state => state.tequilapi.proposals,
        currentId: state => state.tequilapi.currentId
      }) }
  }
</script>

<style scoped>

</style>