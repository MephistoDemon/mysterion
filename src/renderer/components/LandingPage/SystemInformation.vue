<template>
  <div>

    <button class="alt" @click="getIdentities()">getId:s</button><br/>
    <button class="alt" @click="healthcheck()">health</button><br/>
    <button class="alt" @click="connect(host)">Connect</button><br/>
    <button class="alt" @click="kill()">kill</button><br/>
    <input type="text" v-model="host" placeholder="hostname" />
    <div class="title">Status <span v-if="connected==1" style="color:green">CONNECTED</span> </div>
    <pre class="log">{{ error }}</pre>
    <pre class="log">{{ status }}</pre>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    computed: mapState({
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
