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
  <div class="page">
    <div class="page__control control">
      <div class="control__top">
        <h1 :class="{'is-grey':statusCode===-1}" v-text="statusTitle"></h1>
        <div class="control__location" v-if="ip">current IP: {{ip}}</div>
      </div>
      <div class="control__bottom">
        <country-select v-on:selected="setCountry" class="control__countries" :class="{'is-disabled': statusCode!==-1}"/>
        <connection-button :provider-id="providerIdentity"></connection-button>
      </div>
      <div class="control__footer">
        <div class="footer__stats stats">
          <transition name="slide-up">
            <div class="stats__error error" v-if="showError">
              <div class="error__text">
                <div>{{errorMessage}}</div>
              </div>
              <i class="error__close close close--s close--white" @click="hideErr()"></i>
            </div>
          </transition>
          <stats-display :connection="connection"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CountrySelect from '@/components/CountrySelect'
  import type from '../store/types'
  import {mapGetters, mapMutations} from 'vuex'
  import StatsDisplay from '../components/StatsDisplay'
  import ConnectionButton from '@/components/ConnectionButton'
  import AppError from '@/partials/AppError'
  import config from '../config'
  import {ActionLooperConfig} from '../store/modules/connection'

  export default {
    name: 'Main',
    components: {
      CountrySelect,
      ConnectionButton,
      StatsDisplay,
      AppError
    },
    data () {
      return {
        country: null
      }
    },
    computed: {
      ...mapGetters(['connection', 'status', 'ip', 'errorMessage', 'showError']),
      statusCode () {
        switch (this.status) {
          case 'NotConnected': return -1
          case 'Connecting': return 0
          case 'Connected': return 1
        }
      },
      statusTitle () {
        switch (this.status) {
          case 'NotConnected': return 'Disconnected'
          default: return this.status
        }
      },
      providerIdentity () {
        return this.country ? this.country.id : ''
      }
    },
    methods: {
      ...mapMutations({ hideErr: type.HIDE_ERROR }),
      setCountry (data) { this.country = data }
    },
    async mounted () {
      this.$store.dispatch(type.START_ACTION_LOOPING, new ActionLooperConfig(type.CONNECTION_IP, config.ipUpdateThreshold))
      this.$store.dispatch(type.START_ACTION_LOOPING, new ActionLooperConfig(type.FETCH_CONNECTION_STATUS, config.statusUpdateThreshold))
    }
  }
</script>
