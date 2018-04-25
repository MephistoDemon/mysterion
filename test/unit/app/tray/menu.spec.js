import {expect} from 'chai'
import TrayMenu from '../../../../src/app/tray/menu'
import TrayMenuItem from '../../../../src/app/tray/menu-item'

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
    })
  })
})
