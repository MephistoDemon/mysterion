// @flow
import TrayMenuBuilder from '../../../../src/main/tray/menu-builder'
import ConnectionStatusEnum from '../../../../src/libraries/mysterium-tequilapi/dto/connection-status-enum'
import ProposalDTO from '../../../../src/libraries/mysterium-tequilapi/dto/proposal'
import translations from '../../../../src/main/tray/translations'
import { describe, it, expect, beforeEach } from '../../../helpers/dependencies'

class FakeMainCommunication {
  sentConnect: boolean = false
  sentDisconnect: boolean = false

  sendConnectionRequest () {
    this.sentConnect = true
  }

  sendConnectionCancelRequest () {
    this.sentDisconnect = true
  }
}

class FakeApplicationQuitter {
  didQuit: boolean = false

  quit () {
    this.didQuit = true
  }
}

describe('tray', () => {
  describe('TrayMenuBuilder', () => {
    let appQuitter
    let communication
    let builder
    let windowIsVisible = false

    const showWindow = () => {
      windowIsVisible = true
    }

    let devToolsToggled = false
    const toggleDevTools = () => {
      devToolsToggled = !devToolsToggled
    }

    const separator = 'separator'

    beforeEach(() => {
      windowIsVisible = false
      devToolsToggled = false
      communication = new FakeMainCommunication()
      appQuitter = new FakeApplicationQuitter()
      builder = new TrayMenuBuilder(() => appQuitter.quit(), showWindow, toggleDevTools, communication)
    })

    describe('.render', () => {
      it('renders menu items without disconnect when not connected', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.NOT_CONNECTED).build()
        expect(items[1].type).to.equal(separator)
        expect(items[2].label).to.equal(translations.connect)
        expect(items[3].type).to.equal(separator)
        expect(items[4].label).to.equal(translations.showWindow)
        expect(items[5].label).to.equal(translations.toggleDeveloperTools)
        expect(items[6].type).to.equal(separator)
        expect(items[7].label).to.equal(translations.quit)
      })

      it('renders menu items with disconnect when connected', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.CONNECTED).build()
        expect(items[1].type).to.equal(separator)
        expect(items[2].label).to.equal(translations.disconnect)
        expect(items[3].type).to.equal(separator)
        expect(items[4].label).to.equal(translations.showWindow)
        expect(items[5].label).to.equal(translations.toggleDeveloperTools)
        expect(items[6].type).to.equal(separator)
        expect(items[7].label).to.equal(translations.quit)
      })

      it('sets status to connected', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.CONNECTED).build()
        expect(items[0].label).to.equal(translations.statusConnected)
      })

      it('sets status to disconnected', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.NOT_CONNECTED).build()
        expect(items[0].label).to.equal(translations.statusDisconnected)
      })

      it('sets status to connecting', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.CONNECTING).build()
        expect(items[0].label).to.equal(translations.statusConnecting)
      })

      it('sets status to disconnecting', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.DISCONNECTING).build()
        expect(items[0].label).to.equal(translations.statusDisconnecting)
      })

      it('connects', () => {
        builder.updateProposals([
          new ProposalDTO({
            id: 1,
            providerId: '0x0',
            serviceType: 'openvpn',
            serviceDefinition: {
              locationOriginate: {
                country: 'NL'
              }
            }
          })
        ])

        const items = builder.build()
        expect(communication.sentConnect).to.equal(false)
        items[2].submenu[0].click()
        expect(communication.sentConnect).to.equal(true)
      })

      it('disconnects', () => {
        const items = builder.updateConnectionStatus(ConnectionStatusEnum.CONNECTED).build()
        expect(communication.sentDisconnect).to.equal(false)
        items[2].click()
        expect(communication.sentDisconnect).to.equal(true)
      })

      it('shows window', () => {
        const items = builder.build()
        expect(windowIsVisible).to.equal(false)
        items[4].click()
        expect(windowIsVisible).to.equal(true)
      })

      it('quits app', () => {
        const items = builder.build()
        expect(appQuitter.didQuit).to.equal(false)
        items[7].click()
        expect(appQuitter.didQuit).to.equal(true)
      })

      it('toggles developer tools', () => {
        const items = builder.build()
        expect(devToolsToggled).to.equal(false)
        items[5].click()
        expect(devToolsToggled).to.equal(true)
        items[5].click()
        expect(devToolsToggled).to.equal(false)
      })
    })
  })
})
