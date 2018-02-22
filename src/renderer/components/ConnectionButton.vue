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
  import type from '../store/types'

  export default {
    name: 'connection-button',
    props: {
      providerId: {
        type: String
      }
    },
    data () {
      return {}
    },
    computed: {
      ...mapGetters({
        status: 'status',
        consumerId: 'currentIdentity'
      }),
      buttonText: (comp) => {
        let text = 'Connect'
        switch (comp.$store.getters.status) {
          case type.tequilapi.CONNECTED:
            text = 'Disconnect'
            break
          case type.tequilapi.CONNECTING:
            text = 'Connecting'
            break
          case type.tequilapi.NOT_CONNECTED:
            text = 'Connect'
            break
          case type.tequilapi.DISCONNECTING:
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
          this.$store.dispatch(type.DISCONNECT)
          return
        }

        this.$store.dispatch(type.CONNECT, {
          consumerId: this.consumerId,
          providerId: this.providerId
        })
      }
    }
  }
</script>

<style scoped>

</style>
