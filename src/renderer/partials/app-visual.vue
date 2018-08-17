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
  <div class="visual">
    <div class="visual__container">
      <div
        class="visual__object"
        :class="visualClass">
        <div class="visual__circles">
          <i
            class="visual__circle visual__circle--dark"
            :class="visualClass"/>
          <i
            class="visual__circle visual__circle--default"
            :class="visualClass"/>
          <i
            class="visual__circle visual__circle--light"
            :class="visualClass"/>
        </div>
        <div
          class="visual__media"
          :class="visualClass">
          <keep-alive>
            <component
              :is="visual+'Visual'"
              class="visual__image"
              :class="['visual__image--'+visual]"
            />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ConnectionStatusEnum from '../../libraries/mysterium-tequilapi/dto/connection-status-enum'

import headVisual from '@/assets/img/visual--head.svg'

export default {
  name: 'AppVisual',
  components: {
    headVisual
  },
  computed: {
    ...mapGetters(['loading', 'visual', 'route', 'status']),
    visualClass () {
      let classes = []
      if (this.$route.name === 'home') {
        return ['is-pulsing', 'not-connected']
      }

      if (this.loading) {
        classes = ['is-loading', 'is-pulsing']
      } else if (this.$route.name === 'vpn') {
        switch (this.status) {
          case ConnectionStatusEnum.CONNECTED:
            classes = []
            break
          case ConnectionStatusEnum.CONNECTING:
            classes = ['is-pulsing', 'is-disabled']
            break
          case ConnectionStatusEnum.NOT_CONNECTED:
            classes = ['not-connected', 'is-disabled']
            break
          case ConnectionStatusEnum.DISCONNECTING:
            classes = ['is-pulsing', 'not-connected', 'is-disabled']
            break
          default:
            classes = ['not-connected', 'is-disabled']
            break
        }
      }
      return classes
    }
  }
}
</script>
