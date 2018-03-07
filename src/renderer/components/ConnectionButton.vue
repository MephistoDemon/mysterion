<template>
    <div>
        <div class="control__action btn"
             :class="{'btn--transparent':buttonTransparent}"
             @click="connect"
             v-text="buttonText">
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import type from '../store/types'
  import messages from '../../app/messages'

  export default {
    name: 'connection-button',
    props: {
      providerId: {
        type: String
      }
    },
    computed: {
      ...mapGetters({
        status: 'status',
        consumerId: 'currentIdentity'
      }),
      buttonText: (vm) => {
        let text = 'Connect'
        switch (vm.$store.getters.status) {
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
      buttonTransparent: (comp) => {
        const status = comp.$store.getters.status

        return status === 'Connecting' || status === 'Disconnecting' || status === 'Connected'
      }
    },
    methods: {
      connect: function () {
        if (!this.providerId) {
          this.$store.commit(type.SHOW_ERROR_MESSAGE, messages.locationNotSelected)
          return
        }
        if (this.$store.getters.status === type.tequilapi.NOT_CONNECTED) {
          this.$store.dispatch(type.CONNECT, {
            consumerId: this.consumerId,
            providerId: this.providerId
          })
        } else {
          this.$store.dispatch(type.DISCONNECT)
        }
      }
    }
  }
</script>
