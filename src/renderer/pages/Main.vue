<template>
  <div class="page">
    <div class="page__control control">
      <div class="control__version">Pre-alpha v1.0</div>
      <div class="control__top">
        <h1 :class="{'is-grey':status===-1}" v-text="statusTitle"></h1>
        <div class="control__location">current IP:188.69.215.83 (USA)</div>
      </div>
      <div class="control__bottom">
        <country-select v-model="country" class="control__countries" :class="{'is-disabled': status!==-1}"/>
        <div class="control__action btn"
             :class="{'btn--transparent':status!==-1}"
             @click="connectAction"
             v-text="statusActionText"></div>
      </div>
      <div class="control__footer">
        <div class="footer__stats stats">
          <transition name="slide-up">
            <div class="stats__error error" v-if="hasError">
              <div class="error__text">Error message: Ups! We did it again!</div>
              <i class="error__close close close--s close--white" @click="hasError=false"></i>
            </div>
          </transition>
          <div class="stats__container">
            <div class="stats__block">
              <div class="stats__label">TIME</div>
              <div class="stats__value">23:59:96</div>
              <div class="stats__unit">H:M:S</div>
            </div>
            <div class="stats__block">
              <div class="stats__label">DOWNLOADED</div>
              <div class="stats__value">6560430</div>
              <div class="stats__unit">MB</div>
            </div>
            <div class="stats__block">
              <div class="stats__label">UPLOADED</div>
              <div class="stats__value">4493962</div>
              <div class="stats__unit">MB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CountrySelect from '@/components/CountrySelect'
  import type from '../store/types'
  import {mapGetters} from 'vuex'
  import config from '../config'

  async function updateStatus (that) {
    await that.$store.dispatch(type.CONNECTION_STATUS)
    that.timeout = setTimeout(updateStatus.bind(null, that), config.statusUpdateTimeout)
  }

  export default {
    name: 'Main',
    components: {
      CountrySelect
    },
    data () {
      return {
        hasError: false,
        country: null
      }
    },
    computed: {
      ...mapGetters(['connectionStatus']),
      status () {
        switch (this.connectionStatus) {
          case 'NotConnected': return -1
          case 'Connecting': return 0
          case 'Connected': return 1
        }
      },
      statusTitle () {
        switch (this.connectionStatus) {
          case 'NotConnected': return 'Disconnected'
          default: return this.connectionStatus
        }
      },
      statusActionText () {
        return 'Connect'
      }
    },
    methods: {
      connectAction () {
        if (this.status === 1) {
          // connect
        }
      }
    },
    mounted () {
      updateStatus(this)
    },
    beforeDestroy () {
      clearTimeout(this.timeout)
    }
  }
</script>
