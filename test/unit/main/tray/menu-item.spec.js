import {expect} from 'chai'
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
