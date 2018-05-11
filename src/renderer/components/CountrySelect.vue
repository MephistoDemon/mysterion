<template>
    <div class="countries">
        <multiselect class="countries__multiselect"
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
            <template slot="option" slot-scope="props">
                <div class="multiselect__flag">
                    <img :src="imagePath(props.option.code)" class="multiselect__flag-svg"/>
                </div>
                <div class="multiselect__option-title" v-text="countryLabel(props.option)"></div>
            </template>
        </multiselect>

        <i class="countries__flag dropdown-image">
            <img :src="imagePath(country.code)" v-if="country" class="countries__flag-svg"/>
            <icon-world class="countries__flag-svg" v-if="!country"/>
        </i>
    </div>
</template>

<script>
  import path from 'path'
  import type from '@/store/types'
  import messages from '@/../app/messages'
  import {getCountryLabel, getSortedCountryListFromProposals} from '@/../app/countries'
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

        return getCountryLabel(country, 9, 10)
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
      this.rendererCommunication.onProposalUpdate((proposals) => {
        this.countriesAreLoading = false

        if (proposals.length < 1) {
          const error = new Error(messages.countryListIsEmpty)

          this.$store.commit(type.SHOW_ERROR, error)
          this.bugReporter.captureException(error)
          return
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
