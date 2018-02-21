<template>
    <div class="nav" :class="{'is-open':navOpen}">
        <div class="nav__content">
            <div class="nav__navicon" @click="switchNav(!navOpen)">
                <div class="nav__burger burger">
                    <i class="burger__bar burger__bar--1"></i>
                    <i class="burger__bar burger__bar--2"></i>
                    <i class="burger__bar burger__bar--3"></i>
                </div>
            </div>
            <ul class="nav__list">
                <li class="nav__item">
                    <router-link class="nav__trigger" to="/about">
                        <icon-eye class="nav__icon nav__icon--eye"/>
                        <span class="nav__text">about</span>
                    </router-link>
                </li>
                <li class="nav__item">
                    <router-link class="nav__trigger" to="/technology">
                        <icon-cube class="nav__icon nav__icon--cube"/>
                        <span class="nav__text">technology</span>
                    </router-link>
                </li>
                <li class="nav__item">
                    <router-link class="nav__trigger" to="/share">
                        <icon-share class="nav__icon nav__icon--share"/>
                        <span class="nav__text">share</span>
                    </router-link>
                </li>
                <li class="nav__item">
                    <router-link class="nav__trigger" to="/">
                        <span class="nav__text">connect</span>
                    </router-link>
                </li>
                <li class="nav__item">
                    <router-link class="nav__trigger" to="/tutorial/decentralized">
                        <span class="nav__text">tutorial</span>
                    </router-link>
                </li>
                <li class="nav__item">
                    <a class="nav__trigger" href="#" @click="openRemoteLink('https://mysterium.zendesk.com/hc/en-us/requests/new')">
                        <span class="nav__text">report issue</span>
                    </a>
                </li>
            </ul>
            <div class="nav__logout">
                <a class="nav__trigger" href="#" @click="quit()">
                    <icon-quit class="nav__icon nav__icon--quit"/>
                    <span class="nav__text">quit</span>
                </a>
            </div>
        </div>
        <transition name="fade">
            <div v-if="navOpen" class="nav__backdrop" @click="switchNav(false)"></div>
        </transition>
    </div>
</template>

<script>
  import {remote, shell} from 'electron'
  import {mapGetters, mapActions} from 'vuex'
  import IconEye from '@/assets/img/icon--eye.svg'
  import IconCube from '@/assets/img/icon--cube.svg'
  import IconShare from '@/assets/img/icon--share.svg'
  import IconQuit from '@/assets/img/icon--quit.svg'

  export default {
    name: 'AppNav',
    components: {
      IconEye,
      IconCube,
      IconShare,
      IconQuit
    },
    data () {
      return {}
    },
    computed: {
      // mix the getters into computed with object spread operator
      ...mapGetters(['navOpen'])
    },
    methods: {
      ...mapActions(['switchNav']),
      quit () {
        remote.app.quit()
      },
      openRemoteLink (url) {
        shell.openExternal(url)
      }
    },
    mounted () {
    }
  }
</script>
