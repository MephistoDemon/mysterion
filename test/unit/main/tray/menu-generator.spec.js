// @flow

import TrayMenuGenerator, {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  DISCONNECTING
} from '../../../../src/main/tray/menu-generator'

import ProposalDTO from '../../../../src/libraries/api/client/dto/proposal'
import translations from '../../../../src/main/tray/translations'

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
  describe('TrayMenuGenerator', () => {
    let appQuitter
    let communication
    let generator
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
      generator = new TrayMenuGenerator(() => appQuitter.quit(), showWindow, toggleDevTools, communication)
    })

    describe('.render', () => {
      it('renders menu items without disconnect when not connected', () => {
        const items = generator.updateConnectionStatus(DISCONNECTED).generate()
        expect(items[1].type).to.equal(separator)
        expect(items[2].label).to.equal(translations.connect)
        expect(items[3].type).to.equal(separator)
        expect(items[4].label).to.equal(translations.showWindow)
        expect(items[5].label).to.equal(translations.toggleDeveloperTools)
        expect(items[6].type).to.equal(separator)
        expect(items[7].label).to.equal(translations.quit)
      })

      it('renders menu items with disconnect when connected', () => {
        const items = generator.updateConnectionStatus(CONNECTED).generate()
        expect(items[1].type).to.equal(separator)
        expect(items[2].label).to.equal(translations.disconnect)
        expect(items[3].type).to.equal(separator)
        expect(items[4].label).to.equal(translations.showWindow)
        expect(items[5].label).to.equal(translations.toggleDeveloperTools)
        expect(items[6].type).to.equal(separator)
        expect(items[7].label).to.equal(translations.quit)
      })

      it('sets status to connected', () => {
        const items = generator.updateConnectionStatus(CONNECTED).generate()
        expect(items[0].label).to.equal(translations.statusConnected)
      })

      it('sets status to disconnected', () => {
        const items = generator.updateConnectionStatus(DISCONNECTED).generate()
        expect(items[0].label).to.equal(translations.statusDisconnected)
      })

      it('sets status to connecting', () => {
        const items = generator.updateConnectionStatus(CONNECTING).generate()
        expect(items[0].label).to.equal(translations.statusConnecting)
      })

      it('sets status to disconnecting', () => {
        const items = generator.updateConnectionStatus(DISCONNECTING).generate()
        expect(items[0].label).to.equal(translations.statusDisconnecting)
      })

      it('connects', () => {
        generator.updateProposals([
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

        const items = generator.generate()
        expect(communication.sentConnect).to.equal(false)
        items[2].submenu[0].click()
        expect(communication.sentConnect).to.equal(true)
      })

      it('disconnects', () => {
        const items = generator.updateConnectionStatus(CONNECTED).generate()
        expect(communication.sentDisconnect).to.equal(false)
        items[2].click()
        expect(communication.sentDisconnect).to.equal(true)
      })

      it('shows window', () => {
        const items = generator.generate()
        expect(windowIsVisible).to.equal(false)
        items[4].click()
        expect(windowIsVisible).to.equal(true)
      })

      it('quits app', () => {
        const items = generator.generate()
        expect(appQuitter.didQuit).to.equal(false)
        items[7].click()
        expect(appQuitter.didQuit).to.equal(true)
      })

      it('toggles developer tools', () => {
        const items = generator.generate()
        expect(devToolsToggled).to.equal(false)
        items[5].click()
        expect(devToolsToggled).to.equal(true)
        items[5].click()
        expect(devToolsToggled).to.equal(false)
      })
    })
  })
})
