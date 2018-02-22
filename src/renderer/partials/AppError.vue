<template>
    <div class="appError">
        <h4>{{ error.message }}</h4>
        <div>{{ error.hint }}</div>
    </div>
</template>

<style lang="scss">
    .appError {
        font-size: medium;
        line-height: 1.43;
        text-align: center;
        h4 {
            color: red;
            font-weight: 600;
            font-size: x-large;
        }
    }
</style>

<script>
  export default {
    name: 'AppError',
    data () {
      return {}
    },
    props: {
      error: Object
    },
    computed: {},
    methods: {},
    mounted () {
    }
  }
</script>
