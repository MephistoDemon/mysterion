<template>
  <div class="visual">
    <div class="visual__container">
      <div class="visual__object" :class="visualState">
        <div class="visual__circles">
          <i class="visual__circle visual__circle--dark" :class="visualState"></i>
          <i class="visual__circle visual__circle--default" :class="visualState"></i>
          <i class="visual__circle visual__circle--light" :class="visualState"></i>
        </div>
        <div class="visual__media" :class="visualState">
          <keep-alive>
            <component
                :is="visual+'Visual'"
                class="visual__image"
                :class="['visual__image--'+visual]"
            />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import type from '@/store/types'

  import headVisual from '@/assets/img/visual--head.svg'
  import networkingVisual from '@/assets/img/visual--networking.svg'
  import cubeVisual from '@/assets/img/icon--cube.svg'
  import eyeVisual from '@/assets/img/icon--eye.svg'
  import quitVisual from '@/assets/img/icon--quit.svg'

  export default {
    name: 'AppVisual',
    components: {
      headVisual,
      networkingVisual,
      cubeVisual,
      eyeVisual,
      quitVisual
    },
    computed: {
      ...mapGetters(['loading', 'visual', 'route', 'connection']),
      visualState () {
        let classes = []
        if (this.loading) {
          classes = ['is-loading', 'is-pulsing']
        } else if (this.$router.currentRoute.name === 'main') {
          switch (this.connection.status) {
            case type.tequilapi.CONNECTED:
            case type.tequilapi.CONNECTING:
              classes = ['is-pulsing']
              break
            case type.tequilapi.NOT_CONNECTED:
              classes = ['is-pulsing', 'not-connected']
              break
            case type.tequilapi.DISCONNECTING:
              classes = ['is-disabled', 'not-connected']
          }
        }
        return classes
      }
    }
  }
</script>
