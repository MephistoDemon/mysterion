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
        const isTransparent = (
          status === type.tequilapi.CONNECTING ||
          status === type.tequilapi.DISCONNECTING ||
          status === type.tequilapi.CONNECTED
        )

        return isTransparent
      }
    },
    methods: {
      // TODO: rename - name is misleading when this button executes 'disconnect'
      connect: function () {
        const status = this.$store.getters.status
        const canConnect = status === type.tequilapi.NOT_CONNECTED
        const canDisconnect = status === type.tequilapi.CONNECTED

        if (canDisconnect) {
          this.$store.dispatch(type.DISCONNECT)
          return
        }

        if (!this.providerId) {
          this.$store.commit(type.SHOW_ERROR_MESSAGE, messages.locationNotSelected)
          return
        }

        if (canConnect) {
          this.$store.dispatch(type.CONNECT, {
            consumerId: this.consumerId,
            providerId: this.providerId
          })
        }
      }
    }
  }
</script>
