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
  <div
    class="nav"
    :class="{'is-open':navOpen}">
    <div class="nav__content">
      <div
        class="nav__navicon"
        @click="switchNav(!navOpen)">
        <div class="nav__burger burger">
          <i class="burger__bar burger__bar--1"/>
          <i class="burger__bar burger__bar--2"/>
          <i class="burger__bar burger__bar--3"/>
        </div>
      </div>
      <ul class="nav__list">
        <li class="nav__item">
          <a
            class="nav__trigger"
            href="#"
            @click="openRemoteLink('https://mysterium.network/')">
            <icon-eye class="nav__icon nav__icon--eye"/>
            <span class="nav__text">about</span>
          </a>
        </li>
        <li class="nav__item">
          <a
            class="nav__trigger"
            href="#"
            @click="reportIssue">
            <icon-issue class="nav__icon nav__icon--issue"/>
            <span class="nav__text">report issue</span>
          </a>
        </li>
      </ul>
      <div class="nav__settings">
        <disconnect-notification-settings/>
      </div>
      <div class="nav__logout">
        <a
          class="nav__trigger"
          href="#"
          @click="quit()">
          <icon-quit class="nav__icon nav__icon--quit"/>
          <span class="nav__text">quit</span>
        </a>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="navOpen"
        class="nav__backdrop"
        @click="switchNav(false)"/>
    </transition>
  </div>
</template>

<script>
import { remote, shell } from 'electron'
import { mapGetters, mapActions } from 'vuex'
import IconIssue from '@/assets/img/icon--issue.svg'
import IconEye from '@/assets/img/icon--eye.svg'
import IconQuit from '@/assets/img/icon--quit.svg'
import DisconnectNotificationSettings from '@/components/DisconnectNotificationSetting'

export default {
  name: 'AppNav',
  dependencies: ['feedbackForm'],
  components: {
    IconEye,
    IconIssue,
    IconQuit,
    DisconnectNotificationSettings
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(['navOpen'])
  },
  methods: {
    ...mapActions(['switchNav']),
    quit () {
      remote.app.quit()
    },
    openRemoteLink (url) {
      shell.openExternal(url)
    },
    reportIssue () {
      this.feedbackForm.show()
    }
  }
}
</script>
