<template>
    <div>
        <div class="control__action btn"
             :class="{'btn--transparent':buttonTransparent}"
             @click="buttonPressed"
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
            text = 'Cancel'
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
      buttonPressed: function () {
        const status = this.$store.getters.status
        const canConnect = status === type.tequilapi.NOT_CONNECTED
        const canDisconnect = (
          status === type.tequilapi.CONNECTED ||
          status === type.tequilapi.CONNECTING
        )

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
