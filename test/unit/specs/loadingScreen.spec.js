import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import idStore from '@/store/modules/identity'
import propStore from '@/store/modules/proposal'
import mainStore from '@/store/modules/main'
import loadingScreen from '@/components/LoadingScreen'
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
    vm = await mountComponent(tequilapi)
  })

  it('renders and fetches data', () => {
    expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
    expect(vm.$el.querySelector('.status').textContent).to.equal('success')
  })
  it('assigns first fetched ID to state.tequilapi.currentId', () => {
    expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACE'})
  })
  it('fetches & assigns proposals[] to state.tequilapi.proposals', () => {
    expect(vm.$store.state.proposal.list).to.eql([{id: '0xCEEDBEEF'}])
  })
  it('switches view', () => {
    expect(vm.$route.path).to.eql('/main')
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
    vm = await mountComponent(tequilapi)
  })

  it('calls to create new identity and sets currentId', () => {
    expect(vm.$el.querySelector('.status').textContent).to.equal('success')
    expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACY'})
  })
})
