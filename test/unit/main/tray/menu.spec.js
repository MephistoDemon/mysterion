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

import {expect} from 'chai'
import TrayMenu from '../../../../src/main/tray/menu'
import TrayMenuItem from '../../../../src/main/tray/menu-item'

describe('tray', () => {
  describe('TrayMenu', () => {
    describe('.getItems', () => {
      it('returns visible items', () => {
        const menu = new TrayMenu()
        menu.addItem(new TrayMenuItem('first', null, 'cmd+f', null))
        menu.addItem(new TrayMenuItem('second', null, 'cmd+s', null))
        menu.addItem(new TrayMenuItem('third', null, 'cmd+t', null))
        expect(menu.getItems().length).to.equal(3)
      })

      it('ignores invisible items', () => {
        const menu = new TrayMenu()
        menu.addItem((new TrayMenuItem('first', null, 'cmd+f', null)).hide())
        menu.addItem((new TrayMenuItem('second', null, 'cmd+s', null)).hide())
        menu.addItem(new TrayMenuItem('third', null, 'cmd+t', null))
        expect(menu.getItems().length).to.equal(1)
      })

      it('returns tray structure', () => {
        const expected = [
          {
            label: 'first',
            click: null,
            accelerator: 'cmd+f',
            visible: true,
            submenu: null,
            enabled: true,
            type: undefined
          }, {
            label: 'second',
            click: null,
            accelerator: 'cmd+s',
            visible: true,
            submenu: null,
            enabled: true,
            type: undefined
          }, {
            label: 'third',
            click: null,
            accelerator: 'cmd+t',
            visible: true,
            submenu: null,
            enabled: true,
            type: undefined
          }
        ]

        const menu = new TrayMenu()
        menu.addItem(new TrayMenuItem('first', null, 'cmd+f', null))
        menu.addItem(new TrayMenuItem('second', null, 'cmd+s', null))
        menu.addItem(new TrayMenuItem('third', null, 'cmd+t', null))
        expect(menu.getItems()).to.deep.equal(expected)
      })
    })

    describe('.addItem', () => {
      it('adds an item', () => {
        const item = new TrayMenuItem('label', null, 'cmd+l', null)
        const menu = new TrayMenu()
        menu.addItem(item)

        expect(menu.getItems().length).to.equal(1)
        expect(menu._items).to.deep.eql([item])
      })
    })
  })
})
