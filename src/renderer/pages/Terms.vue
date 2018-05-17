<template>
  <div class="terms">
    <div class="terms-content">
      <div style="height:10vh;border-bottom:1px solid #eee"></div>
      <div class="terms-box">
        <div style="padding:1rem 8rem;" v-html="termsAndConditions.htmlContent"></div>
      </div>
    </div>
    <div class="terms-actions">
      <a href="#" class="control__action btn" @click.prevent="accept">Accept and launch Mysterion</a>
      <a href="#" class="control__action btn btn-danger" @click.prevent="decline">Decline</a>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'terms',
    dependencies: ['rendererCommunication'],
    methods: {
      accept () {
        this._answerTerms(true)
      },
      decline () {
        this._answerTerms(false)
      },
      _answerTerms (answer) {
        this.rendererCommunication.sendTermsAnswered({isAccepted: answer})
      }
    },
    computed: {
      ...mapGetters(['termsAndConditions'])
    }
  }
</script>

<style lang="less">
  .terms {
    height: 100vh;
    .terms-content {
      margin-bottom: 50px;
    }
    .terms-box {
      height: 80vh;
      overflow: scroll;
    }
    .terms-actions {
      position: fixed;
      bottom: 0;
      padding: 10px;
      width: 100%;
      text-align: center;
      background-color: #fff;
      border-top: 1px solid #eee;
      .btn {
        font-size: 1.5rem;
        max-width: 30rem;
        width: auto;
        &.btn-danger {
          background-color: #a60404;
          border-color: #a60404;
        }
      }
    }
  }
</style>
