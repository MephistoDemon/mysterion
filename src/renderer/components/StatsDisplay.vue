<template>
  <div class="stats__container">
    <div class="stats__block">
      <div class="stats__label">TIME</div>
      <div class="stats__value">{{connection.stats.duration | secToString}}</div>
      <div class="stats__unit">H:M:S</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">RECEIVED</div>
      <div class="stats__value">{{connection.stats.bytesReceived | bytesToMB}}</div>
      <div class="stats__unit">MB</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">SENT</div>
      <div class="stats__value">{{connection.stats.bytesSent | bytesToMB}}</div>
      <div class="stats__unit">MB</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'stats-display',
    props: {
      connection: {}
    },
    filters: {
      secToString (val) {
        const h = Math.floor(val / 3600)
        const m = Math.floor((val - h * 3600) / 60)
        const s = (val - h * 3600 - m * 60)
        return `${h}:${m}:${s}`
      },
      bytesToMB (val) {
        return (val / (1024 ** 2)).toLocaleString(undefined, {maximumFractionDigits: 2})
      }
    }
  }
</script>

<style scoped>

</style>