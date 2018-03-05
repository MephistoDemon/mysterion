<template>
    <app-modal :close="false">
        <h1>{{ status.message }}</h1>
    </app-modal>
</template>
<script>
  import AppModal from '@/partials/AppModal'
  import AppError from '@/partials/AppError'
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        error: null,
        status: {
          message: 'App is loading, please wait'
        }
      }
    },
    components: {
      AppModal,
      AppError
    },
    computed: {
      ...mapGetters(['errorInMain', 'clientIsRunning'])
    },
    name: 'boot'
  }
</script>
