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
  import tequilAPI from '@/../libraries/api/tequilapi'
  import IconWorld from '@/assets/img/icon--world.svg'
  import type from '@/store/types'
  import messages from '@/../app/messages'
  import bugReporter from '@/../app/bugReporting/bug-reporting'

  let tequilapi

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

  function isNetworkUnreachable (err) {
    return (
      err.response &&
      err.response.data &&
      err.response.data.message &&
      err.response.data.message.includes('connect: network is unreachable')
    )
  }

  export default {
    name: 'CountrySelect',
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
          const response = await tequilapi.proposal.list()
          this.countriesList = response.proposals.map(proposalToCountry)
        } catch (e) {
          console.log('Countries loading failed', e)

          if (isNetworkUnreachable(e)) {
            this.$store.commit(type.OVERLAY_ERROR, messages.countriesLoadingNetworkError)
          } else {
            this.$store.commit(type.SHOW_ERROR_MESSAGE, messages.countriesLoadingFailed)
          }

          bugReporter.renderer.captureException(e)
        }

        this.countriesAreLoading = false
      }
    },
    mounted () {
      tequilapi = tequilAPI()
    }
  }
</script>
