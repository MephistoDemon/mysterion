<template>
    <div></div>
</template>
<script>
  import AppModal from '@/partials/AppModal'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        status: {
          message: 'App is loading, please wait'
        }
      }
    },
    components: {
      AppModal
    },
    computed: {
      ...mapGetters(['overlayError'])
    },
    name: 'home'
  }
</script>
