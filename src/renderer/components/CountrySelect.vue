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
      class="countries__multiselect pull-left"
      style="float: left; width: 85%"
      :max-height="120"
      v-model="country"
      :custom-label="selectedCountryLabel"
      placeholder="Choose country"
      :options="countryList"
      :loading="countriesAreLoading"
      :searchable="true"
      :show-labels="false"
      @open="fetchCountries"
      @input="onChange">
      <template
        slot="option"
        slot-scope="props">
        <span
          style="color: #99cc33"
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
import type from '@/store/types'
import messages from '@/../app/messages'
import { getCountryLabel, getSortedCountryListFromProposals } from '@/../app/countries'
import Multiselect from 'vue-multiselect'
import IconWorld from '@/assets/img/icon--world.svg'

export default {
  name: 'CountrySelect',
  dependencies: ['rendererCommunication', 'bugReporter'],
  components: {
    Multiselect,
    IconWorld
  },
  data () {
    return {
      country: null,
      countryList: [],
      countriesAreLoading: false
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
      if (!code) {
        code = 'world'
      }

      return path.join('static', 'flags', code.toLowerCase() + '.svg')
    },
    async fetchCountries () {
      this.countriesAreLoading = true
      this.rendererCommunication.sendProposalUpdateRequest()
    }
  },
  mounted () {
    // eslint-disable-next-line
    console.log('mounted')
    this.rendererCommunication.onProposalUpdate((proposals) => {
      this.countriesAreLoading = false

      if (proposals.length < 1) {
        const error = new Error(messages.countryListIsEmpty)

        this.$store.commit(type.SHOW_ERROR, error)
        this.bugReporter.captureErrorException(error)
        return
      }

      // TODO: remove
      for (let i = 0; i < 3; i++) {
        const newProposal = Object.assign({}, proposals[0])
        newProposal.providerId = 'id_' + i
        proposals.push(newProposal)
      }

      this.countryList = getSortedCountryListFromProposals(proposals)
    })

    this.rendererCommunication.onConnectionRequest((proposal) => {
      const selectedCountry = this.countryList.find((country) => country.id === proposal.providerId)

      this.country = selectedCountry
      this.$emit('selected', selectedCountry)
    })
  }
}
</script>
