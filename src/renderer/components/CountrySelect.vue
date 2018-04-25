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
  import countryList from '@/plugins/countries'
  import Multiselect from 'vue-multiselect'
  import IconWorld from '@/assets/img/icon--world.svg'
  import type from '@/store/types'
  import messages from '@/../app/messages'
  import bugReporter from '@/../app/bugReporting/bug-reporting'

  function proposalToCountry (proposal) {
    let code
    if (typeof proposal.serviceDefinition !== 'undefined' &&
      typeof proposal.serviceDefinition.locationOriginate !== 'undefined' &&
      typeof proposal.serviceDefinition.locationOriginate.country !== 'undefined') {
      code = proposal.serviceDefinition.locationOriginate.country.toLowerCase()
    }
    return {
      label: code ? countryList.GetName(code) : proposal.providerId,
      id: proposal.providerId,
      code: code
    }
  }

  export default {
    name: 'CountrySelect',
    dependencies: ['tequilapi'],
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

        return path.join('static', 'flags', code + '.svg')
      },
      async fetchCountries () {
        this.countriesAreLoading = true

        try {
          const response = await this.tequilapi.proposal.list()
          if (response.proposals.length < 1) {
            this.$store.commit(type.SHOW_ERROR, {message: messages.countryListIsEmpty})
          }
          this.countriesList = response.proposals.map(proposalToCountry)
        } catch (e) {
          console.log('Countries loading failed', e)

          const error = new Error(messages.countryLoadingFailed)
          error.original = e

          this.$store.commit(type.SHOW_ERROR, error)
          bugReporter.renderer.captureException(error)
        }

        this.countriesAreLoading = false
      }
    }
  }
</script>
