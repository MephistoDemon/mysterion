<template>
    <div class="countries">
        <multiselect class="countries__multiselect"
                     :max-height="120"
                     v-model="country"
                     :custom-label="countryLabel"
                     placeholder="Choose country"
                     :options="countries"
                     :searchable="false"
                     :show-labels="false"
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
  import {mapState} from 'vuex'
  import path from 'path'
  import countryList from '@/plugins/countries'
  import Multiselect from 'vue-multiselect'
  import IconWorld from '@/assets/img/icon--world.svg'

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
    props: {
      value: {}
    },
    components: {
      Multiselect,
      IconWorld
    },
    data () {
      return {
        country: null
      }
    },
    computed: {
      ...mapState({
        countries: (state) => state.proposal.list.map(proposalToCountry)
      })
    },
    methods: {
      onChange (country) {
        this.$emit('change', country)
        this.$emit('input', country)
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
      }
    }
  }
</script>
<style lang="less">

</style>