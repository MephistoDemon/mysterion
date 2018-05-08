<template>
    <div class="countries">
        <multiselect class="countries__multiselect"
                     :max-height="120"
                     v-model="country"
                     :custom-label="countryLabel"
                     placeholder="Choose country"
                     :options="countriesList"
                     :loading="countriesAreLoading"
                     :searchable="false"
                     :show-labels="false"
                     @open="fetchCountries"
                     @input="onChange">
            <template slot="option" slot-scope="props">
                <div class="multiselect__flag">
                    <img :src="imagePath(props.option.code)" class="multiselect__flag-svg"/>
                </div>
                <div class="multiselect__option-title" v-text="props.option.label"></div>
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
  import {getCountryCodeFromProposal, getCountryNameFromProposal} from '@/../app/countries'
  import Multiselect from 'vue-multiselect'
  import IconWorld from '@/assets/img/icon--world.svg'

  function proposalToCountry (proposal) {
    return {
      label: getCountryNameFromProposal(proposal),
      id: proposal.providerId,
      code: getCountryCodeFromProposal(proposal)
    }
  }

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
        countriesList: [],
        countriesAreLoading: false
      }
    },
    methods: {
      onChange (country) {
        this.$emit('selected', country)
      },
      countryLabel (country) {
        if (typeof country === 'object') {
          return country.label
        }
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
          const error = new Error(messages.countriesLoadingFailed)

          this.$store.commit(type.SHOW_ERROR, error)
          this.bugReporter.captureException(error)
          return
        }

        this.countriesList = proposals.map(proposalToCountry)
      })
    }
  }
</script>
