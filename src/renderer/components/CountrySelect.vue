<template>
    <div class="countries">
        <multiselect class="countries__multiselect"
                     :max-height="120"
                     :custom-label="countryLabel"
                     :value="country"
                     placeholder="Choose country"
                     :options="countries"
                     :searchable="false"
                     :show-labels="false"
                     @input="select">
            <template slot="option" slot-scope="props">
                <div class="multiselect__flag">
                    <img :src="imagePath(props.option)" class="multiselect__flag-svg"/>
                </div>
                <div class="multiselect__option-title" v-text="allCountries[props.option]"></div>
            </template>
        </multiselect>

        <i class="countries__flag">
            <component class="countries__flag-svg" v-bind:is="country+'Flag'"
                       v-if="country"/>
            <icon-world class="countries__flag-svg" v-if="!country"/>
        </i>
    </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import path from 'path'
  import allCountries from '@/plugins/countries'
  import Multiselect from 'vue-multiselect'
  import IconWorld from '@/assets/img/icon--world.svg'

  export default {
    name: 'CountrySelect',
    components: {
      Multiselect,
      IconWorld
    },
    data () {
      return {
        countries: ['us', 'gb', 'lt', 'lv', 'ru', 'ee', 'it', 'es', 'pl'],
        allCountries: allCountries
      }
    },
    computed: {
      ...mapGetters(['country'])
    },
    methods: {
      ...mapActions(['selectCountry']),
      select (country) {
        this.selectCountry(country)
      },
      countryLabel (country) {
        return this.allCountries[country]
      },
      imagePath (code) {
        return path.join('static', 'flags', code + '.svg')
      }
    }
  }
</script>
