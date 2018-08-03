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

import { expect } from 'chai'
import TrayMenu from '../../../../src/main/tray/menu'
import TrayMenuItem from '../../../../src/main/tray/menu-item'
import TrayMenuSeparator from '../../../../src/main/tray/menu-item-separator'

describe('tray', () => {
  const getItem = () => new TrayMenuItem('first', null, 'cmd+f', null)

  describe('TrayMenuItem', () => {
    it('is visible by default', () => {
      const item = getItem()
      expect(item.visible).to.eql(true)
    })

    it('hides', () => {
      const item = getItem().hide()
      expect(item.visible).to.eql(false)
    })

    it('shows', () => {
      const item = getItem().hide().show()
      expect(item.visible).to.eql(true)
    })

    it('changes label', () => {
      const item = getItem().setLabel('test')
      expect(item.label).to.eql('test')
    })

    it('.enable', () => {
      const item = getItem().enable()
      expect(item.enabled).to.eql(true)
    })

    it('.disable', () => {
      const item = getItem().disable()
      expect(item.enabled).to.eql(false)
    })

    describe('.toObject', () => {
      it('serializes to electron tray menu item structure', () => {
        const subMenu = new TrayMenu()
        subMenu.add('sub', null, 'cmd+s')

        const click = () => {}
        const item = new TrayMenuItem('first', click, 'cmd+f', subMenu)

        const obj = item.toTrayStructure()
        expect(obj.label).to.equal('first')
        expect(obj.click).to.equal(click)
        expect(obj.accelerator).to.equal('cmd+f')
        expect(obj.submenu[0].label).to.equal('sub')
        expect(obj.submenu[0].click).to.equal(null)
        expect(obj.submenu[0].accelerator).to.equal('cmd+s')
        expect(obj.submenu[0].submenu).to.equal(null)
      })
    })

    describe('TrayMenuSeparator', () => {
      it('has submenu type', () => {
        const item = new TrayMenuSeparator()
        expect(item.type).to.eql('separator')
      })
    })
  })
})
