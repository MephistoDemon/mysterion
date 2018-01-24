/* eslint no-unused-expressions: 0 */
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import idStore from '@/store/modules/identity'
import propStore from '@/store/modules/proposal'
import mainStore from '@/store/modules/main'
import loadingScreen from '@/pages/Loading'
import tequilAPI from '@/../api/tequilapi'

import MockAdapter from 'axios-mock-adapter'

Vue.use(Vuex)

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
    const tequilapi = tequilAPI()
    const mock = new MockAdapter(tequilapi.__axio)
    mock.onGet('/proposals').reply(200, {proposals: [{id: '0xCEEDBEEF'}]})
    mock.onGet('/identities').reply(200, {identities: [{id: '0xC001FACE'}]})
    mock.onPut('/identities/0xC001FACE/unlock').reply(200)
    vm = await mountComponent(tequilapi)
  })

  it('loads without errors', () => {
    expect(vm.$store.state.main.init).to.eql('success')
    expect(vm.$store.state.main.error).to.eql({})
  })
  it('assigns first fetched ID to state.tequilapi.currentId', () => {
    expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACE'})
  })
  it('fetches & assigns proposals[] to state.tequilapi.proposals', () => {
    expect(vm.$store.state.proposal.list).to.eql([{id: '0xCEEDBEEF'}])
  })
})

describe('loading screen when no identities returned', () => {
  let vm

  before(async () => {
    const tequilapi = tequilAPI()
    const mock = new MockAdapter(tequilapi.__axio)
    mock.onGet('/identities').replyOnce(200, {identities: []})
    mock.onGet('/proposals').replyOnce(200, {proposals: [{id: '0xCEEDBEEF'}]})
    mock.onPost('/identities').replyOnce(200, {id: '0xC001FACY'})
    mock.onPut('/identities/0xC001FACY/unlock').replyOnce(200)
    vm = await mountComponent(tequilapi)
  })

  it('loads without errors', () => {
    expect(vm.$store.state.main.init).to.eql('success')
    expect(vm.$store.state.main.error).to.eql({})
  })
  it('creates and unlocks identity', () => {
    expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACY'})
    expect(vm.$store.state.identity.unlocked).to.be.true
  })
  it('sets store.main.newUser true', () => {
    expect(vm.$store.state.main.newUser).to.be.true
  })
})
