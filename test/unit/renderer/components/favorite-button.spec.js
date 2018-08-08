/*
 * Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import { describe, expect, it } from '../../../helpers/dependencies'
import Vue from 'vue'
import FavoriteButton from '@/components/favorite-button.vue'
import { CallbackRecorder } from '../../../helpers/utils'

function mount (component: Object, propsData: Object) {
  const Constructor = Vue.extend(component)
  return new Constructor({ propsData }).$mount()
}

describe('favoriteButton', () => {
  it('binds to toggleFavorite', () => {
    const cbRec = new CallbackRecorder()
    const vm = mount(FavoriteButton, { toggleFavorite: cbRec.getCallback() })
    vm.toggleFavorite()
    expect(cbRec.invoked).to.be.true
  })

  it('renders button text - a star', () => {
    const country = { isFavorite: true }
    const vm = mount(FavoriteButton, {
      toggleFavorite: () => {},
      country
    })
    expect(vm.buttonText).to.eql('★')
    country.isFavorite = false
    expect(vm.buttonText).to.eql('☆')
  })
})
