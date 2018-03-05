<template>
    <app-modal :close="false">
        <h1>{{ status.message }}</h1>
    </app-modal>
</template>
<script>
  import AppModal from '@/partials/AppModal'

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
    name: 'home'
  }
</script>
