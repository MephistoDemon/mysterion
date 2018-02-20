<template>
    <div class="terms">
        <div class="terms-content">
            <h1>Terms and conditions <small>v{{ termsAndConditions.version | version }}</small></h1>
            <div><p>{{ termsAndConditions.content }}</p></div>
        </div>
        <div class="terms-actions">
            <a href="#" class="control__action btn" @click.prevent="accept">Accept and launch Mysterion</a>
            <a href="#" class="control__action btn btn-danger" @click.prevent="decline">Decline</a>
        </div>
    </div>
</template>
<script>
  import {ipcRenderer} from 'electron'
  import {mapGetters} from 'vuex'
  import communication from '../../libraries/communication'

  export default {
    name: 'terms',
    methods: {
      accept () {
        ipcRenderer.send(communication.TERMS_ANSWERED, true)
      },
      decline () {
        ipcRenderer.send(communication.TERMS_ANSWERED, false)
      }
    },
    filters: {
      version (number) {
        return parseFloat(Math.round(number * 100) / 100).toFixed(1)
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
            padding: 20px;
            margin-bottom: 50px;
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
