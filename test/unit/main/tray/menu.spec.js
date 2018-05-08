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
