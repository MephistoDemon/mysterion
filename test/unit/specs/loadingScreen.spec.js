/* eslint no-unused-expressions: 0 */
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'

import idStore from '@/store/modules/identity'
import propStore from '@/store/modules/proposal'
import {tequilapi} from '@/../libraries/api/tequilapi'
import loadingScreen from '@/pages/VpnLoader'

import MockAdapter from 'axios-mock-adapter'
import config from '@/config'

// eslint-disable-next-line import/no-webpack-loader-syntax
import mainStoreInjector from 'inject-loader!@/store/modules/main'
const mainStore = mainStoreInjector({
  '../../../libraries/api/tequilapi': {tequilapi}
}).default
Vue.use(Vuex)
Vue.use(Router)

const router = new Router({routes: []})
const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))
const mountVM = async (vm) => {
  await vm.$mount()
}

async function mountComponent (tequilapi) {
  const store = new Vuex.Store({
    modules: {
      identity: {...idStore(tequilapi)},
      proposal: {...propStore(tequilapi)},
      main: mainStore
    },
    strict: false
  })
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: {'test': loadingScreen},
    store,
    router
  })
  await mountVM(vm)
  return vm
}

describe('loading screen', () => {
  let vm
  before(async () => {
    const mock = new MockAdapter(tequilapi.__axio)
    mock.onGet('/proposals').reply(200, {proposals: [{id: '0xCEEDBEEF'}]})
    mock.onGet('/identities').reply(200, {identities: [{id: '0xC001FACE'}]})
    mock.onGet('/healthcheck').replyOnce(200, {version: {commit: 'caed3112'}})
    mock.onPut('/identities/0xC001FACE/unlock').reply(200)
    vm = await mountComponent(tequilapi)
  })

  it('loads without errors', async () => {
    await delay(config.loadingScreenDelay)
    expect(vm.$store.state.main.init).to.eql('INIT_SUCCESS')
    expect(vm.$store.state.main.error).to.eql(null)
  })
  it('assigns first fetched ID to state.tequilapi.currentId', () => {
    expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACE'})
  })
  it('fetches & assigns proposals[] to state.tequilapi.proposals', () => {
    expect(vm.$store.state.proposal.list).to.eql([{id: '0xCEEDBEEF'}])
  })
  it('routes to main', () => {
    expect(vm.$route.path).to.be.eql('/vpn')
  })
})

describe('loading screen when no identities returned', () => {
  let vm

  before(async () => {
    const mock = new MockAdapter(tequilapi.__axio)
    mock.onGet('/identities').replyOnce(200, {identities: []})
    mock.onGet('/proposals').replyOnce(200, {proposals: [{id: '0xCEEDBEEF'}]})
    mock.onGet('/healthcheck').replyOnce(200, {version: {commit: 'caed3112'}})
    mock.onPost('/identities').replyOnce(200, {id: '0xC001FACY'})
    mock.onPut('/identities/0xC001FACY/unlock').replyOnce(200)
    vm = await mountComponent(tequilapi)
  })

  it('loads without errors', async () => {
    await delay(config.loadingScreenDelay)
    expect(vm.$store.state.main.init).to.eql('INIT_SUCCESS')
    expect(vm.$store.state.main.error).to.eql(null)
  })
  it('creates and unlocks identity', () => {
    expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACY'})
    expect(vm.$store.state.identity.unlocked).to.be.true
  })
  it('sets store.main.newUser true', () => {
    expect(vm.$store.state.main.newUser).to.be.true
  })
  it('routes to main', () => {
    expect(vm.$route.path).to.be.eql('/vpn')
  })
})
