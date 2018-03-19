<template>
  <div class="page">
    <div class="page__control control">
      <div class="control__top">
        <h1 :class="{'is-grey':status===-1}" v-text="statusTitle"></h1>
        <div class="control__location" v-if="ip">current IP: {{ip}}</div>
      </div>
      <div class="control__bottom">
        <country-select v-model="country" class="control__countries" :class="{'is-disabled': status!==-1}"/>
        <connection-button :provider-id="providerIdentity"></connection-button>
      </div>
      <div class="control__footer">
        <div class="footer__stats stats">
          <transition name="slide-up">
            <div class="stats__error error" v-if="showError">
              <div class="error__text">
                <div>{{errorMessage}}</div>
              </div>
              <i class="error__close close close--s close--white" @click="hideErr()"></i>
            </div>
          </transition>
          <stats-display :connection="connection"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CountrySelect from '@/components/CountrySelect'
  import type from '../store/types'
  import {mapGetters, mapMutations} from 'vuex'
  import StatsDisplay from '../components/StatsDisplay'
  import ConnectionButton from '@/components/ConnectionButton'
  import AppError from '@/partials/AppError'
  import config from '../config'

  // TODO: move to config
  const CONNECTION_IP_THRESHOLD = 10000

  export default {
    name: 'Main',
    components: {
      CountrySelect,
      ConnectionButton,
      StatsDisplay,
      AppError
    },
    data () {
      return {
        country: null
      }
    },
    computed: {
      ...mapGetters(['connection', 'ip', 'errorMessage', 'showError', 'visibleStatus']),
      status () {
        switch (this.visibleStatus) {
          case 'NotConnected': return -1
          case 'Connecting': return 0
          case 'Connected': return 1
        }
      },
      statusTitle () {
        switch (this.visibleStatus) {
          case 'NotConnected': return 'Disconnected'
          default: return this.visibleStatus
        }
      },
      providerIdentity () {
        return this.country ? this.country.id : ''
      }
    },
    methods: {
      ...mapMutations({ hideErr: type.HIDE_ERROR })
    },
    async mounted () {
      this.$store.dispatch(type.START_ACTION_LOOPING, {
        action: type.CONNECTION_IP,
        threshold: CONNECTION_IP_THRESHOLD
      })
      this.$store.dispatch(type.START_ACTION_LOOPING, {
        action: type.FETCH_CONNECTION_STATUS,
        threshold: config.statusUpdateThreshold
      })
    },
    beforeDestroy () {
    }
  }
</script>
