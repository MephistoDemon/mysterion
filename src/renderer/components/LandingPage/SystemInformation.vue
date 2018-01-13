<template>
  <div>
    <pre class="log">{{ error }}</pre>
    <pre class="log">{{ status }}</pre>
    <pre class="log">{{ currentId }}</pre>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    computed: mapState({
      currentId: state => state.tequilapi.currentId.id,
      status: state => state.myst_cli.log,
      error: state => state.myst_cli.err,
      connected: state => state.myst_cli.status
    }),
    data () {
      return {
        host: ''
      }
    },
    methods: {
      healthcheck () {
        this.$store.dispatch('healthcheck')
      },
      getIdentities () {
        this.$store.dispatch('getIdentities')
      },
      connect (host) {
        this.$store.dispatch('connect', host)
      },
      kill () {
        this.$store.dispatch('kill')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }
  .log {
    max-width: 500px;
    overflow: scroll;
  }

  button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

</style>
