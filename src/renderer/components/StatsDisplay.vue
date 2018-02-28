<template>
  <div class="stats__container">
    <div class="stats__block">
      <div class="stats__label">TIME</div>
      <div class="stats__value">{{connection.stats.duration | secToString}}</div>
      <div class="stats__unit">H:M:S</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">RECEIVED</div>
      <div class="stats__value">{{received.value}}</div>
      <div class="stats__unit">{{received.suffix}}</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">SENT</div>
      <div class="stats__value">{{sent.value}}</div>
      <div class="stats__unit">{{sent.suffix}}</div>
    </div>
  </div>
</template>

<script>
  import size from 'file-size'

  export default {
    name: 'stats-display',
    props: {
      connection: {}
    },
    computed: {
      received: (vm) => {
        const sizeInfo = size(vm.connection.stats.bytesReceived).calculate()
        return {value: sizeInfo.fixed, suffix: sizeInfo.suffix}
      },
      sent: (vm) => {
        const sizeInfo = size(vm.connection.stats.bytesSent).calculate()
        return {value: sizeInfo.fixed, suffix: sizeInfo.suffix}
      }
    },
    filters: {
      secToString (val) {
        let h = Math.floor(val / 3600)
        h = h > 9 ? h : '0' + h
        let m = Math.floor((val - h * 3600) / 60)
        m = m > 9 ? m : '0' + m
        let s = (val - h * 3600 - m * 60)
        s = s > 9 ? s : '0' + s
        return `${h}:${m}:${s}`
      }
    }
  }
</script>

<style scoped>

</style>