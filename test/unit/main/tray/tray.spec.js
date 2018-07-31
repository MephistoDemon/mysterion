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

import translations from '../../../../src/main/tray/translations'
import Tray from '../../../../src/main/tray/tray'
import {expect} from '../../../helpers/dependencies'
import ConnectionStatusEnum from '../../../../src/libraries/mysterium-tequilapi/dto/connection-status-enum'

describe('tray', () => {
  describe('Tray', () => {
    const iconPath = ''
    const menuItemBuilder = {
      build () {
      }
    }

    const menuTemplateBuilder = () => {
    }

    const fakeTrayFactoryBuilder = (init = null, tooltip = null, menu = null, image = null, on = null) => {
      if (typeof init === 'function') {
        init()
      }

      const methods = {
        setToolTip: tooltip,
        setContextMenu: menu,
        setImage: image,
        on: on
      }

      let electronTray = {}
      for (let method in methods) {
        if (typeof methods[method] !== 'function') {
          electronTray[method] = () => null

          continue
        }

        electronTray[method] = methods[method]
      }

      return () => electronTray
    }

    describe('.build', () => {
      it('calls electron tray tequilapiClientFactory', () => {
        let called = false

        const factory = fakeTrayFactoryBuilder(() => {
          called = true
        })

        const tray = new Tray(factory, menuTemplateBuilder, menuItemBuilder, iconPath)
        tray.build()

        expect(called).to.equal(true)
      })

      it('sets tooltip text', () => {
        let tooltipText
        const factory = fakeTrayFactoryBuilder(null, (text) => {
          tooltipText = text
        })

        const tray = new Tray(factory, menuTemplateBuilder, menuItemBuilder, iconPath)
        tray.build()

        expect(tooltipText).to.equal(translations.name)
      })

      it('sets context menu', () => {
        let contextMenu

        const factory = fakeTrayFactoryBuilder(null, null, (menu) => {
          contextMenu = menu
        })

        const items = ['item1', 'item2']
        const menuTemplateBuilder = () => items
        const tray = new Tray(factory, menuTemplateBuilder, menuItemBuilder, iconPath)
        tray.build()

        expect(contextMenu).to.deep.equal(items)
      })
    })

    describe('.setStatus', () => {
      it('calls updateConnectionStatus and setContextMenu', () => {
        let calledUpdateConnectionStatus = false
        let calledSetContextMenu = false

        const factory = fakeTrayFactoryBuilder(null, null, () => {
          calledSetContextMenu = true
        })
        const menuItemBuilder = {
          build () {

          },
          updateConnectionStatus () {
            calledUpdateConnectionStatus = true
          }
        }

        const tray = new Tray(factory, (items) => items, menuItemBuilder, iconPath)

        tray.build()
        tray.setStatus(ConnectionStatusEnum.CONNECTED)

        expect(calledSetContextMenu).to.equal(true)
        expect(calledUpdateConnectionStatus).to.equal(true)
      })
    })

    describe('.setCountries', () => {
      it('calls updateCountries and setContextMenu', () => {
        let calledUpdateCountries = false
        let calledSetContextMenu = false

        const factory = fakeTrayFactoryBuilder(null, null, () => {
          calledSetContextMenu = true
        })
        const menuItemBuilder = {
          build () {

          },
          updateCountries () {
            calledUpdateCountries = true
          }
        }

        const tray = new Tray(factory, (items) => items, menuItemBuilder, iconPath)

        tray.build()
        tray.setCountries([])

        expect(calledSetContextMenu).to.equal(true)
        expect(calledUpdateCountries).to.equal(true)
      })

      it('doesn\'t rerender tray, but updates proposals when tray is open', () => {
        let calledUpdateCountries = false
        let calledSetContextMenu = 0

        const factory = fakeTrayFactoryBuilder(null, null, () => {
          calledSetContextMenu++
        })
        const menuItemBuilder = {
          build () {

          },
          updateCountries () {
            calledUpdateCountries = true
          }
        }

        const tray = new Tray(factory, (items) => items, menuItemBuilder, iconPath)
        tray._canUpdateItems = false
        tray.build()
        tray.setCountries([])

        // if calledSetContextMenu is larger than 1 it means tray._update() was called
        expect(calledSetContextMenu).to.equal(1)
        expect(calledUpdateCountries).to.equal(true)
      })
    })
  })
})
