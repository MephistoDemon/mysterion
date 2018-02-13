<template>
    <div class="modal">
        <i class="modal__close close" @click="$store.dispatch('switchModal', null)" v-if="close"></i>
        <div class="modal__dialog" :class="{'modal__dialog--s':size==='s'}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'AppModal',
    data () {
      return {}
    },
    props: {
      size: {
        default: null
      },
      close: {
        default: true
      }
    },
    computed: {},
    methods: {},
    mounted () {
    }
  }
</script>
