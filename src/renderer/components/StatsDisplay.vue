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
  import size from 'file-size'

  function bytesToUnits (val) {
    if (typeof val !== 'number') return { value: val, units: 'KB' }
    else {
      const calculated = size(val).calculate()
      return { value: calculated.fixed, units: calculated.suffix }
    }
  }

  export default {
    name: 'stats-display',
    props: {
      connection: {}
    },
    computed: {
      received: (vm) => {
        return bytesToUnits(vm.connection.stats.bytesReceived)
      },
      sent: (vm) => {
        return bytesToUnits(vm.connection.stats.bytesSent)
      }
    },
    filters: {
      secToString (val) {
        if (typeof val !== 'number') {
          return val
        } else {
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
  }
</script>

<style scoped>

</style>