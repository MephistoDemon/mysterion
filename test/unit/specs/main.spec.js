import {expect} from 'chai'

import main from '@/store/modules/main'
import type from '@/store/types'

describe('mutations', () => {
  describe('SHOW_ERROR', () => {
    it('saves message and shows it with ordinary error', () => {
      const state = {}
      const err = new Error('My error')
      main.mutations[type.SHOW_ERROR](state, err)
      expect(state.showError).to.eql(true)
      expect(state.errorMessage).to.eql('My error')
    })

    it('saves message and shows it with response error', () => {
      const state = {}
      const err = new Error('My error')
      err.response = {
        data: {
          message: 'Response message'
        }
      }
      main.mutations[type.SHOW_ERROR](state, err)
      expect(state.showError).to.eql(true)
      expect(state.errorMessage).to.eql('Response message')
    })

    it('displays Unknown error if no error.message found', () => {
      const state = {}
      const err = new Error()
      main.mutations[type.SHOW_ERROR](state, err)
      expect(state.showError).to.eql(true)
      expect(state.errorMessage).to.eql('Unknown error')
    })
  })

  describe('SHOW_ERROR_MESSAGE', () => {
    it('saves message and shows it', () => {
      const state = {}
      main.mutations[type.SHOW_ERROR_MESSAGE](state, 'error message')
      expect(state.showError).to.eql(true)
      expect(state.errorMessage).to.eql('error message')
    })
  })

  describe('HIDE_ERROR', () => {
    it('hides error', () => {
      const state = {
        showError: true
      }
      main.mutations[type.HIDE_ERROR](state)
      expect(state.showError).to.eql(false)
    })
  })
})
