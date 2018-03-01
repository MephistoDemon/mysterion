<template>
  <div class="stats__container">
    <div class="stats__block">
      <div class="stats__label">TIME</div>
      <div class="stats__value">{{connection.stats.duration | timeDisplay}}</div>
      <div class="stats__unit">H:M:S</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">RECEIVED</div>
      <div class="stats__value">{{received.value || '-'}}</div>
      <div class="stats__unit">{{received.units}}</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">SENT</div>
      <div class="stats__value">{{sent.value || '-'}}</div>
      <div class="stats__unit">{{sent.units}}</div>
    </div>
  </div>
</template>

<script>
  import {bytesReadable} from '../../libraries/unitConverter'

  export default {
    name: 'stats-display',
    props: {
      connection: {}
    },
    computed: {
      received: (vm) => {
        return bytesReadable(vm.connection.stats.bytesReceived)
      },
      sent: (vm) => {
        return bytesReadable(vm.connection.stats.bytesSent)
      }
    }
  }
</script>

<style scoped>

</style>