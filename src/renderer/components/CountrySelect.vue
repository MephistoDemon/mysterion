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
  <div class="countries">
    <multiselect
      class="countries__multiselect"
      :max-height="120"
      v-model="country"
      track-by="id"
      :custom-label="selectedCountryLabel"
      placeholder="Choose country"
      :options="countryList"
      :loading="countriesAreLoading"
      :searchable="true"
      :show-labels="false"
      :show-pointer="false"
      @open="fetchCountries"
      @input="onChange">
      <template
        slot="option"
        slot-scope="props">
        <span
          class="multiselect__option-star"
          v-if='props.option.isFavorite'>
          ★
        </span>
        <div class="multiselect__flag">
          <img
            :src="imagePath(props.option.code)"
            class="multiselect__flag-svg">
        </div>
        <div
          class="multiselect__option-title"
          v-text="countryLabel(props.option)"/>
      </template>
    </multiselect>

    <i class="countries__flag dropdown-image">
      <img
        :src="imagePath(country.code)"
        v-if="country"
        class="countries__flag-svg">
      <icon-world
        class="countries__flag-svg"
        v-if="!country"/>
    </i>
  </div>
</template>

<script>
import path from 'path'
import { getCountryLabel, isCountryUnresolved } from '../../app/countries'
import Multiselect from 'vue-multiselect'
import IconWorld from '@/assets/img/icon--world.svg'

export default {
  name: 'CountrySelect',
  dependencies: ['rendererCommunication', 'bugReporter'],
  props: {
    countryList: {
      type: Array,
      required: true
    },
    countriesAreLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    fetchCountries: {
      type: Function,
      required: true
    }
  },
  components: {
    Multiselect,
    IconWorld
  },
  data () {
    return {
      country: null,
      unresolvedCountryList: []
    }
  },
  methods: {
    onChange (country) {
      this.$emit('selected', country)
    },
    selectedCountryLabel (country) {
      if (typeof country !== 'object') {
        return
      }

      return getCountryLabel(country, 10)
    },
    countryLabel (country) {
      if (typeof country !== 'object') {
        return
      }

      return getCountryLabel(country)
    },
    imagePath (code) {
      if (!isCountryUnresolved(code)) {
        if (this.unresolvedCountryList.indexOf(code) < 0) {
          this.unresolvedCountryList.push(code)
          this.bugReporter.captureInfoMessage('Country not found, code: ' + code)
        }
        code = 'world'
      }

      return path.join('static', 'flags', code.toLowerCase() + '.svg')
    },
    onConnectionRequest (proposal) {
      const selectedCountry = this.countryList.find((country) => country.id === proposal.providerId)

      this.country = selectedCountry
      this.$emit('selected', selectedCountry)
    }
  },
  mounted () {
    this.rendererCommunication.onConnectionRequest(this.onConnectionRequest)
  },
  beforeDestroy () {
    this.rendererCommunication.removeConnectionRequestCallback(this.onConnectionRequest)
  }
}
</script>
