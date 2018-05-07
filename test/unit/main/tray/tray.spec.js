import TrayMenuGenerator from '../../../../src/main/tray/menu-generator'
import translations from '../../../../src/main/tray/translations'
import Tray from '../../../../src/main/tray/tray'
import {expect} from '../../../helpers/dependencies'

describe('tray', () => {
  describe('Tray', () => {
    const generator = {
      generate () {
      }
    }
    const menuBuilder = () => {
    }

    const fakeTrayFactory = (init = null, tooltip = null, menu = null, image = null, on = null) => {
      if (typeof init === 'function') {
        init()
      }

      const methods = {
        'setToolTip': tooltip,
        'setContextMenu': menu,
        'setImage': image,
        'on': on
      }

      const factory = {}
      for (let method in methods) {
        if (typeof methods[method] !== 'function') {
          factory[method] = () => {
          }

          continue
        }

        factory[method] = methods[method]
      }

      return () => factory
    }

    describe('.build', () => {
      it('calls electron tray factory', () => {
        let called = false

        const factory = fakeTrayFactory(() => {
          called = true
        })

        const tray = new Tray(factory, menuBuilder, generator)
        tray.build()

        expect(called).to.equal(true)
      })

      it('sets tooltip text', () => {
        let tooltipText
        const factory = fakeTrayFactory(null, (text) => {
          tooltipText = text
        })

        const tray = new Tray(factory, menuBuilder, generator)
        tray.build()

        expect(tooltipText).to.equal(translations.name)
      })

      it('sets context menu', () => {
        let contextMenu

        const factory = fakeTrayFactory(null, null, (menu) => {
          contextMenu = menu
        })

        const items = ['item1', 'item2']
        const menuBuilder = () => items
        const tray = new Tray(factory, menuBuilder, generator)
        tray.build()

        expect(contextMenu).to.deep.equal(items)
      })
    })

    describe('.setStatus', () => {
      it('calls updateConnectionStatus and setContextMenu', () => {
        let calledUpdateConnectionStatus = false
        let calledSetContextMenu = false

        const factory = fakeTrayFactory(null, null, () => {
          calledSetContextMenu = true
        })
        const generator = {
          generate () {

          },
          updateConnectionStatus () {
            calledUpdateConnectionStatus = true
          }
        }

        const tray = new Tray(factory, (items) => items, generator)

        tray.build()
        tray.setStatus('CONNECTED')

        expect(calledSetContextMenu).to.equal(true)
        expect(calledUpdateConnectionStatus).to.equal(true)
      })
    })

    describe('.setProposals', () => {
      it('calls updateProposals and setContextMenu', () => {
        let calledUpdateProposals = false
        let calledSetContextMenu = false

        const factory = fakeTrayFactory(null, null, () => {
          calledSetContextMenu = true
        })
        const generator = {
          generate () {

          },
          updateProposals () {
            calledUpdateProposals = true
          }
        }

        const tray = new Tray(factory, (items) => items, generator)

        tray.build()
        tray.setProposals([])

        expect(calledSetContextMenu).to.equal(true)
        expect(calledUpdateProposals).to.equal(true)
      })

      it('doesn\'t update proposals when tray is open', () => {
        let calledUpdateProposals = false

        const factory = fakeTrayFactory()
        const generator = {
          generate () {

          },
          updateProposals () {
            calledUpdateProposals = true
          }
        }

        const tray = new Tray(factory, (items) => items, generator)
        tray._canUpdateItems = false
        tray.build()
        tray.setProposals([])

        expect(calledUpdateProposals).to.equal(false)
      })
    })
  })
})
