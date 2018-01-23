<template>
  <div id="app" class="app">
    <app-nav class="app__nav" v-if="!loading" />
    <router-view class="app__page" v-if="!loading" />
    <transition name="fade" v-if="visual">
      <app-visual class="app__visual" />
    </transition>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import AppVisual from '@/partials/AppVisual'
  import AppModal from '@/partials/AppModal'
  import AppNav from '@/partials/AppNav'

  export default {
    components: {
      AppVisual,
      AppModal,
      AppNav
    },
    name: 'App',
    computed: {
      ...mapGetters(['loading', 'visual'])
    }
  }
</script>

<style src="@/assets/less/index.less" lang="less">

</style>
