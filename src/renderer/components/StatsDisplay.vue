<template>
  <div class="stats__container">
    <div class="stats__block">
      <div class="stats__label">TIME</div>
      <div class="stats__value">{{duration}}</div>
      <div class="stats__unit">H:M:S</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">RECEIVED</div>
      <div class="stats__value">{{received.value}}</div>
      <div class="stats__unit">{{received.units}}</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">SENT</div>
      <div class="stats__value">{{sent.value}}</div>
      <div class="stats__unit">{{sent.units}}</div>
    </div>
  </div>
</template>

<script>
  import {bytesReadable, timeDisplay} from '../../libraries/unitConverter'

  export default {
    name: 'stats-display',
    props: {
      connection: {
        type: Object,
        default () { return {stats: {}} }
      }
    },
    computed: {
      duration () {
        try {
          return timeDisplay(this.connection.stats.duration)
        } catch (err) {
          return '--:--:--'
        }
      },
      received (vm) {
        try {
          return bytesReadable(vm.connection.stats.bytesReceived)
        } catch (err) {
          return { value: '-', units: 'KB' }
        }
      },
      sent (vm) {
        try {
          return bytesReadable(vm.connection.stats.bytesSent)
        } catch (err) {
          return { value: '-', units: 'KB' }
        }
      }
    }
  }
</script>
