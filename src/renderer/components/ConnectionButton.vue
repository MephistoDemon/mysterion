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
  import ConnectionStatusEnum from '../../libraries/api/client/dto/connection-status-enum'
  import messages from '../../app/messages'
  import ConnectionRequestDTO from '../../libraries/api/client/dto/connection-request'

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
          case ConnectionStatusEnum.CONNECTED:
            text = 'Disconnect'
            break
          case ConnectionStatusEnum.CONNECTING:
            text = 'Cancel'
            break
          case ConnectionStatusEnum.NOT_CONNECTED:
            text = 'Connect'
            break
          case ConnectionStatusEnum.DISCONNECTING:
            text = 'Disconnecting'
            break
        }
        return text
      },
      buttonTransparent: (comp) => {
        const status = comp.$store.getters.status
        const isTransparent = (
          status === ConnectionStatusEnum.CONNECTING ||
          status === ConnectionStatusEnum.DISCONNECTING ||
          status === ConnectionStatusEnum.CONNECTED
        )

        return isTransparent
      }
    },
    methods: {
      buttonPressed: function () {
        const status = this.$store.getters.status
        const canConnect = status === ConnectionStatusEnum.NOT_CONNECTED
        const canDisconnect = (
          status === ConnectionStatusEnum.CONNECTED ||
          status === ConnectionStatusEnum.CONNECTING
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
          this.$store.dispatch(type.CONNECT, new ConnectionRequestDTO(this.consumerId, this.providerId))
        }
      }
    }
  }
</script>
