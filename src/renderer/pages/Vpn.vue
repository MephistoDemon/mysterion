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
        <h1
          :class="{'is-grey':statusCode===-1}"
          v-text="statusTitle"/>
        <div
          class="control__location"
          v-if="ip">current IP: {{ ip }}</div>
      </div>

      <div class="control__bottom">
        <div
          class="control__countries">
          <div class="control__countries__row" />
          <country-select
            :country-list="countryList"
            :countries-are-loading="countriesAreLoading"
            :fetch-countries="fetchCountries"
            @selected="setCountry"
            :class="{'is-disabled': statusCode!==-1}"/>
          <favorite-button
            style="flex:1 0 0; text-align:left;"
            :country="country"
            :toggle-favorite="toggleFavorite"/>
        </div>
        <connection-button :provider-id="providerIdentity"/>
      </div>

      <div class="control__footer">
        <div class="footer__stats stats">
          <transition name="slide-up">
            <div
              class="stats__error error"
              v-if="showError">
              <div class="error__text">
                <div>{{ errorMessage }}</div>
              </div>
              <i
                class="error__close close close--s close--white"
                @click="hideErr()"/>
            </div>
          </transition>
          <stats-display :connection="connection"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountrySelect from '../components/CountrySelect'
import type from '../store/types'
import { mapGetters, mapMutations } from 'vuex'
import StatsDisplay from '../components/StatsDisplay'
import ConnectionButton from '../components/ConnectionButton'
import AppError from '../partials/AppError'
import config from '../config'
import { ActionLooperConfig } from '../store/modules/connection'
import FavoriteButton from '../components/favorite-button'
export default {
  name: 'Main',
  components: {
    FavoriteButton,
    CountrySelect,
    ConnectionButton,
    StatsDisplay,
    AppError
  },
  dependencies: ['bugReporter', 'rendererCommunication'],
  data () {
    return {
      country: null,
      countryList: [],
      countriesAreLoading: false
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
    setCountry (data) { this.country = data },
    fetchCountries () {
      this.countriesAreLoading = true
      this.rendererCommunication.sendProposalUpdateRequest()
    },
    async toggleFavorite () {
      if (!this.country) return
      this.country = { ...this.country, isFavorite: !this.country.isFavorite }
      this.countryList.find((c) => c.id === this.country.id).isFavorite = this.country.isFavorite

      this.rendererCommunication.sendToggleFavoriteProvider({ id: this.country.id, isFavorite: this.country.isFavorite })
    },
    onCountriesUpdate (countries) {
      this.countriesAreLoading = false

      if (countries.length < 1) this.bugReporter.captureInfoMessage('Renderer received empty countries list')

      this.countryList = countries
    }
  },
  async mounted () {
    this.rendererCommunication.onCountriesUpdate(this.onCountriesUpdate)
    this.$store.dispatch(type.START_ACTION_LOOPING, new ActionLooperConfig(type.CONNECTION_IP, config.ipUpdateThreshold))
    this.$store.dispatch(type.START_ACTION_LOOPING, new ActionLooperConfig(type.FETCH_CONNECTION_STATUS, config.statusUpdateThreshold))
  },
  beforeDestroy () {
    this.rendererCommunication.removeCountriesUpdateCallback(this.onCountriesUpdate)
  }
}
</script>
