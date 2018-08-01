<!--
  - Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License
  - along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
  <div class="stats__container">
    <div class="stats__block">
      <div class="stats__label">TIME</div>
      <div class="stats__value">{{ duration }}</div>
      <div class="stats__unit">H:M:S</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">RECEIVED</div>
      <div class="stats__value">{{ received.value }}</div>
      <div class="stats__unit">{{ received.units }}</div>
    </div>
    <div class="stats__block">
      <div class="stats__label">SENT</div>
      <div class="stats__value">{{ sent.value }}</div>
      <div class="stats__unit">{{ sent.units }}</div>
    </div>
  </div>
</template>

<script>
import { bytesReadable, timeDisplay } from '../../libraries/unitConverter'

export default {
  name: 'StatsDisplay',
  props: {
    connection: {
      type: Object,
      default () { return { stats: {} } }
    }
  },
  computed: {
    duration () {
      try {
        return timeDisplay(this.connection.statistics.duration)
      } catch (err) {
        return '--:--:--'
      }
    },
    received (vm) {
      try {
        return bytesReadable(vm.connection.statistics.bytesReceived)
      } catch (err) {
        return { value: '-', units: 'KB' }
      }
    },
    sent (vm) {
      try {
        return bytesReadable(vm.connection.statistics.bytesSent)
      } catch (err) {
        return { value: '-', units: 'KB' }
      }
    }
  }
}
</script>
