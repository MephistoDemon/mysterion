<template>
  <div>
    <h1 class="h1">Loading</h1>
    <p>{{currentId}}</p>
    <router-link to="/info">info</router-link>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    mounted () {
      this.$store.dispatch('init')
    },
    computed: mapState({
      currentId: state => state.tequilapi.currentId
    }),
    name: 'loading-screen'
  }
</script>