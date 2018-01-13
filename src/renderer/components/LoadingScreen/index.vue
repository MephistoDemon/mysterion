<template>
  <div>
    <h1 class="h1">Loading</h1>
    <p>{{currentId}}</p>
    <p>{{error.message}}</p>
    <p>{{error.request.responseURL}}</p>
    <p>{{error.response.data.message}}</p>

    <router-link to="/info">info</router-link>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    async mounted () {
      console.log(this.$store.state.tequilapi.error)
      try {
        await this.$store.dispatch('init')
        this.$router.push('/info')
      } catch (err) {
        console.dir(err)
      }
    },
    computed: mapState({
      currentId: state => state.tequilapi.currentId,
      error: state => state.tequilapi.error
    }),
    name: 'loading-screen'
  }
</script>