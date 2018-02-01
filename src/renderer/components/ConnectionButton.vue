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
        status: 'status',
        identity: 'currentIdentity'
      }),
      buttonText: (comp) => {
        let text = 'Connect'
        switch (comp.$store.getters.status) {
          case 'Connected':
            text = 'Disconnect'
            break
          case 'Connecting':
            text = 'Connecting'
            break
          case 'NotConnected':
            text = 'Connect'
            break
          case 'Disconnecting':
            text = 'Disconnecting'
            break
        }
        return text
      },
      isConnecting: comp => comp.$store.getters.status === 'Connecting',
      isDisconnecting: comp => comp.$store.getters.status === 'Disconnecting',
      isConnected: comp => comp.$store.getters.status === 'Connected'
    },
    methods: {
      connect: function () {
        if (this.isConnecting || this.isDisconnecting) {
          return
        }

        if (this.isConnected) {
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
