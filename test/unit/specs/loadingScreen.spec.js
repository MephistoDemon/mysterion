import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import teqStore from '@/store/modules/tequil'
import loadingScreen from '@/components/LoadingScreen'
import tequilAPI from '@/../api/tequilapi'

import MockAdapter from 'axios-mock-adapter'

Vue.use(Vuex)

const mountVM = async (vm) => {
  await vm.$mount();
}

describe('loading screen', () => {
  let vm
  before(async () => {
    const teq = tequilAPI()
    const mock = new MockAdapter(teq.__axio)
    mock.onGet('/proposals').reply(200, {proposals: [{id: '0xCEEDBEEF'}]})
    mock.onGet('/identities').reply(200, {identities: [{id: '0xC001FACE'}]})
    const store = new Vuex.Store({modules: {tequil: {...teqStore(teq)}}})
    vm = new Vue({
      template: '<div><test></test></div>',
      components: {'test': loadingScreen},
      store,
      router
    })
    await mountVM(vm)
  })

  it('renders and fetches data', () => {
    expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
    expect(vm.$el.querySelector('.status').textContent).to.equal('success')
  })
  it('assigns first fetched ID to state.tequilapi.currentId', () => {
    expect(vm.$store.state.tequil.currentId).to.eql({id: '0xC001FACE'})
  })
  it('fetches & assigns proposals[] to state.tequilapi.proposals', () => {
    expect(vm.$store.state.tequil.proposals).to.eql([{id: '0xCEEDBEEF'}])
  })
  it('switches view', () => {
    expect(vm.$route.path).to.eql('/main')
  })
})

describe('loading screen when no identities returned', () => {
  let vm

  before(async () => {
    const teq = tequilAPI()
    const mock = new MockAdapter(teq.__axio)
    mock.onGet('/identities').replyOnce(200, {identities: []})
    mock.onGet('/proposals').replyOnce(200, {proposals: [{id: '0xCEEDBEEF'}]})
    mock.onPost('/identities').replyOnce(200, {id: '0xC001FACY'})
    const store = new Vuex.Store({modules: {tequil: {...teqStore(teq)}}})
    vm = new Vue({
      template: '<div><test></test></div>',
      components: {'test': loadingScreen},
      store,
      router
    })
    await mountVM(vm)
  })

  it('calls to create new identity and sets currentId', () => {
    expect(vm.$el.querySelector('.status').textContent).to.equal('success')
    expect(vm.$store.state.tequil.currentId).to.eql({id: '0xC001FACY'})
  })
})
