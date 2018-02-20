<template>
    <app-modal :close="false">
        <h1 v-if="!errorInMain">{{ status.message }}</h1>
        <app-error v-if="errorInMain" :error="errorInMain"></app-error>
    </app-modal>
</template>
<script>
  import AppModal from '@/partials/AppModal'
  import AppError from '@/partials/AppError'
  import {mapGetters} from 'vuex'

  export default {
    async mounted () {

    },
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
