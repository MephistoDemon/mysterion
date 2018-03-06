<template>
    <div id="app" class="app">
        <div id="content">
            <div class="control__version">v{{version}}</div>
            <app-modal v-if="!clientIsRunning" :close="false">
                <app-error :error="error"></app-error>
            </app-modal>
            <app-nav class="app__nav" v-if="!loading"/>
            <router-view class="app__page"/>
            <transition name="fade" v-if="visual">
                <app-visual class="app__visual"/>
            </transition>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import type from '@/store/types'
  import AppVisual from '@/partials/AppVisual'
  import AppModal from '@/partials/AppModal'
  import AppNav from '@/partials/AppNav'
  import AppError from '@/partials/AppError'
  import {ipcRenderer, remote} from 'electron'

  export default {
    name: 'App',
    components: {
      AppVisual,
      AppModal,
      AppNav,
      AppError
    },
    computed: {
      ...mapGetters(['loading', 'visual', 'clientIsRunning', 'buildInfo']),
      version () {
        return remote.getGlobal('__version') + ' Build id: ' + this.buildInfo.commit
      }
    },
    data () {
      return {
        error: {
          message: 'Mysterium client seems to be down.',
          hint: 'Please wait while it re-launches. If this message persists, please contact support.'
        }
      }
    },
    async mounted () {
      let oldClientIsRunning = true

      ipcRenderer.send('renderer.booted', true)
      ipcRenderer.on('healthcheck', (event, clientIsRunning) => {
        // if the client was down, but now up, we need to unlock the identity once again
        if (clientIsRunning === true && oldClientIsRunning === false) {
          this.$store.dispatch(type.IDENTITY_UNLOCK)
        }
        this.$store.dispatch('setClientRunningState', oldClientIsRunning = clientIsRunning)
      })
    }
  }
</script>

<style src="@/assets/less/index.less" lang="less"></style>
