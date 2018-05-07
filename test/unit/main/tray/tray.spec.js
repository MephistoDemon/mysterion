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
      it('calls electron tray factory', () => {
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

    describe('.setProposals', () => {
      it('calls updateProposals and setContextMenu', () => {
        let calledUpdateProposals = false
        let calledSetContextMenu = false

        const factory = fakeTrayFactoryBuilder(null, null, () => {
          calledSetContextMenu = true
        })
        const menuItemBuilder = {
          build () {

          },
          updateProposals () {
            calledUpdateProposals = true
          }
        }

        const tray = new Tray(factory, (items) => items, menuItemBuilder, iconPath)

        tray.build()
        tray.setProposals([])

        expect(calledSetContextMenu).to.equal(true)
        expect(calledUpdateProposals).to.equal(true)
      })

      it('doesn\'t update proposals when tray is open', () => {
        let calledUpdateProposals = false

        const factory = fakeTrayFactoryBuilder()
        const menuItemBuilder = {
          build () {

          },
          updateProposals () {
            calledUpdateProposals = true
          }
        }

        const tray = new Tray(factory, (items) => items, menuItemBuilder, iconPath)
        tray._canUpdateItems = false
        tray.build()
        tray.setProposals([])

        expect(calledUpdateProposals).to.equal(false)
      })
    })
  })
})
