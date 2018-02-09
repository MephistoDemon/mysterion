<template>
    <div id="app" class="app">
        <div id="content">
            <app-modal v-if="!isRunning" :close="false">
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
  import AppVisual from '@/partials/AppVisual'
  import AppModal from '@/partials/AppModal'
  import AppNav from '@/partials/AppNav'
  import AppError from '@/partials/AppError'
  import ShowNotification from '../libraries/notifications'

  let showNotificationOnError = true

  const healthCheckInterval = 2000
  const healthCheck = async function (component) {
    // if the app is quitting we shouldn't continue checking the client
    if (component.$store.getters.isQuitting) {
      return
    }

    try {
      await component.$store.dispatch('healthCheck')
      showNotificationOnError = true
    } catch (e) {
      if (showNotificationOnError === true) {
        ShowNotification(component.error.message, component.error.hint, 5)
        showNotificationOnError = false
      }
    }

    setTimeout(() => healthCheck(component), healthCheckInterval)
  }

  export default {
    components: {
      AppVisual,
      AppModal,
      AppNav,
      AppError
    },
    name: 'App',
    computed: {
      ...mapGetters(['loading', 'visual', 'isRunning'])
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
      await healthCheck(this)
    }
  }
</script>

<style src="@/assets/less/index.less" lang="less"></style>
