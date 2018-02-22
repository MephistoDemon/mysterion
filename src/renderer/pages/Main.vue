<template>
  <div class="page">
    <div class="page__control control">
      <div class="control__version">Pre-alpha v0.1</div>
      <div class="control__top">
        <h1 :class="{'is-grey':status===-1}" v-text="statusTitle"></h1>
        <div class="control__location" v-if="ip">current IP: {{ip}}</div>
      </div>
      <div class="control__bottom">
        <country-select v-model="country" class="control__countries" :class="{'is-disabled': status!==-1}"/>
        {{country}}
        <connection-button :provider-id="providerIdentity"></connection-button>
      </div>
      <div class="control__footer">
        <div class="footer__stats stats">
          <transition name="slide-up">
            <div class="stats__error error" v-if="showReqErr">
              <div class="error__text">
                <div v-if="!requestErr.response">{{requestErr.message}}</div>
                <div v-if="requestErr.response">{{requestErr.response.data.message}}</div>
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
      ...mapGetters(['connection', 'ip', 'statusText', 'requestErr', 'showReqErr']),
      status () {
        switch (this.connection.status) {
          case 'NotConnected': return -1
          case 'Connecting': return 0
          case 'Connected': return 1
        }
      },
      statusTitle () {
        switch (this.connection.status) {
          case 'NotConnected': return 'Disconnected'
          default: return this.connection.status
        }
      },
      providerIdentity () {
        return this.country ? this.country.id : ''
      }
    },
    methods: {
      ...mapMutations({ hideErr: type.HIDE_REQ_ERR })
    },
    mounted () {
      this.$store.dispatch(type.CONNECTION_IP)
      this.$store.dispatch(type.CONNECTION_STATUS_ALL)
    },
    beforeDestroy () {
    }
  }
</script>
