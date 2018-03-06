import {expect} from 'chai'

import main from '@/store/modules/main'
import type from '@/store/types'

describe('mutations', () => {
  describe('SHOW_ERROR', () => {
    it('makes correct error message with ordinary error', () => {
      const state = {}
      const err = new Error('My error')
      main.mutations[type.SHOW_ERROR](state, err)
      expect(state.errorMessage).to.eql('My error')
    })

    it('makes correct error message with response error', () => {
      const state = {}
      const err = new Error('My error')
      err.response = {
        data: {
          message: 'Response message'
        }
      }
      main.mutations[type.SHOW_ERROR](state, err)
      expect(state.errorMessage).to.eql('Response message')
    })
  })
})
