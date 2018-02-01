<template>
  <div class="stats__container">
    <div class="stats__block">
      <div class="stats__label">TIME</div>
      <div class="stats__value">{{connection.stats.duration}}</div>
      <div class="stats__unit">H:M:S</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">RECEIVED</div>
      <div class="stats__value">{{connection.stats.bytesReceived}}</div>
      <div class="stats__unit">MB</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">SENT</div>
      <div class="stats__value">{{connection.stats.bytesSent}}</div>
      <div class="stats__unit">MB</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'stats-display',
    props: {
      connection: {}
    }
  }
</script>

<style scoped>

</style>