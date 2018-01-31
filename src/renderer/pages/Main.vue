<template>
  <div class="page">
    <div class="page__control control">
      <div class="control__version">Pre-alpha v0.1</div>
      <div class="control__top">
        <h1 :class="{'is-grey':status===-1}" v-text="statusTitle"></h1>
        <div class="control__location" v-if="ip">current IP:{{ip}}</div>
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
              <div class="stats__value">{{connection.stats.duration}}</div>
              <div class="stats__unit">H:M:S</div>
            </div>
            <div class="stats__block">
              <div class="stats__label">DOWNLOADED</div>
              <div class="stats__value">{{connection.stats.bytesReceived}}</div>
              <div class="stats__unit">MB</div>
            </div>
            <div class="stats__block">
              <div class="stats__label">UPLOADED</div>
              <div class="stats__value">{{connection.stats.bytesSent}}</div>
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

  async function updateStatusRun (that) {
    await that.$store.dispatch(type.CONNECTION_STATUS)
    that.timeout = setTimeout(updateStatusRun.bind(null, that), config.statusUpdateTimeout)
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
      ...mapGetters(['connection', 'ip']),
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
      statusActionText () {
        return 'Connect'
      }
    },
    methods: {
      connectAction () {
        if (this.status === -1) {
          updateStatusRun(this)
        }
      }
    },
    mounted () {
      this.$store.dispatch(type.CONNECTION_IP_GET)
    },
    beforeDestroy () {
      clearTimeout(this.timeout)
    }
  }
</script>
