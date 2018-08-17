/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
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

import Vue from 'vue'
import StatsDisplay from '../../../../src/renderer/components/StatsDisplay'

const mount = function (connection) {
  // TODO Migrate to createLocalVue() from package '@vue/test-utils'
  const vm = new Vue({
    template: '<div><stats-display :connection="connection"/></div>',
    components: { 'stats-display': StatsDisplay },
    data: { connection: connection }
  })

  return vm.$mount()
}

describe('StatsDisplay', () => {
  const initialConnectionState = {
    statistics: {}
  }

  it('renders and displays statistics', () => {
    const vm = mount(initialConnectionState)
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.eql('--:--:--')
    expect(els[1].textContent).to.eql('-')
    expect(els[2].textContent).to.eql('-')
  })

  it('displays statistics formatting', () => {
    const vm = mount({
      statistics: {
        duration: 13325,
        bytesReceived: 1232133, // 1.17505 MB
        bytesSent: 123321 // 0.117608 MB
      }
    })
    const els = vm.$el.querySelectorAll('.stats__value')
    expect(els[0].textContent).to.eql('03:42:05')
    expect(els[1].textContent).to.eql('1.18')
    expect(els[2].textContent).to.eql('120.43')
    const unitEls = vm.$el.querySelectorAll('.stats__unit')
    expect(unitEls[1].textContent).to.eql('MB')
    expect(unitEls[2].textContent).to.eql('KB')
  })
})
