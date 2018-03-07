<template>
    <div class="visual">
        <div class="visual__container">
            <div class="visual__object" :class="visualClass">
                <div class="visual__circles">
                    <i class="visual__circle visual__circle--dark" :class="visualClass"></i>
                    <i class="visual__circle visual__circle--default" :class="visualClass"></i>
                    <i class="visual__circle visual__circle--light" :class="visualClass"></i>
                </div>
                <div class="visual__media" :class="visualClass">
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

  export default {
    name: 'AppVisual',
    components: {
      headVisual
    },
    computed: {
      ...mapGetters(['loading', 'visual', 'route', 'connection']),
      visualClass () {
        let classes = []
        if (this.$route.name === 'home') {
          return ['is-pulsing', 'not-connected']
        }

        if (this.loading) {
          classes = ['is-loading', 'is-pulsing']
        } else if (this.$route.name === 'vpn') {
          switch (this.$store.state.connection.status) {
            case type.tequilapi.CONNECTED:
              classes = []
              break
            case type.tequilapi.CONNECTING:
              classes = ['is-pulsing', 'is-disabled']
              break
            case type.tequilapi.NOT_CONNECTED:
              classes = ['not-connected', 'is-disabled']
              break
            case type.tequilapi.DISCONNECTING:
              classes = ['is-pulsing', 'not-connected', 'is-disabled']
              break
            default:
              classes = ['not-connected', 'is-disabled']
              break
          }
        }
        return classes
      }
    }
  }
</script>
