<template>
    <div>
        <div class="control__action btn"
             :class="{'btn--transparent':isConnecting||isDisconnecting}"
             @click="connect"
             v-text="buttonText">
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'connection-button',
    props: {
      nodeId: {
        type: String
      }
    },
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        isConnecting: 'isConnecting',
        isDisconnecting: 'isDisconnecting',
        buttonText: 'buttonText',
        identity: 'currentIdentity'
      })
    },
    methods: {
      connect: function () {
        if (this.$store.getters.isConnecting || this.$store.getters.isDisconnecting) {
          return
        }

        if (this.$store.getters.isConnected) {
          this.$store.dispatch('disconnect')
          return
        }

        this.$store.dispatch('connect', {
          identity: this.identity,
          nodeId: this.nodeId
        })
      }
    }
  }
</script>

<style scoped>

</style>
