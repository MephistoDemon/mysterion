import {expect} from 'chai'
import TrayMenuGenerator, {CONNECTED, CONNECTING, DISCONNECTED, DISCONNECTING} from '../../../../src/main/tray/menu-generator'
import ProposalDto from '../../../../src/libraries/api/client/dto/proposal'
import FakeQuitter from '../../../helpers/app-quitter'
import FakeMainCommunication from '../../../helpers/main-communication'
import FakeWindow from '../../../helpers/window'

describe('tray', () => {
  describe('TrayMenuGenerator', () => {
    let appQuitter
    let window
    let communication
    let generator

    beforeEach(() => {
      window = new FakeWindow()
      communication = new FakeMainCommunication()
      appQuitter = new FakeQuitter()
      generator = new TrayMenuGenerator(() => appQuitter.quit(), window, communication)
    })

    describe('.onUpdate', () => {
      it('status update triggers listeners', () => {
        let callCount = 0

        generator.onUpdate(() => callCount++)
        generator.updateConnectionStatus(true)

        expect(callCount).to.equal(1)
      })

      it('proposal update triggers listeners', () => {
        let callCount = 0

        generator.onUpdate(() => callCount++)
        generator.updateProposals(null)

        expect(callCount).to.equal(1)
      })

      it('generator supports multiple update listeners', () => {
        let callCount = 0

        const update = () => callCount++

        generator.onUpdate(update).onUpdate(update)
        generator.updateProposals(null)
        generator.updateConnectionStatus(false)

        expect(callCount).to.equal(4)
      })
    })

    describe('.render', () => {
      it('renders menu items without disconnect when not connected', () => {
        const items = generator.updateConnectionStatus(DISCONNECTED).generate()
        expect(items[1].type).to.equal('separator')
        expect(items[2].label).to.equal('Connect')
        expect(items[3].type).to.equal('separator')
        expect(items[4].label).to.equal('Show window')
        expect(items[5].label).to.equal('Toggle developer tools')
        expect(items[6].type).to.equal('separator')
        expect(items[7].label).to.equal('Quit')
      })

      it('renders menu items with disconnect when connected', () => {
        const items = generator.updateConnectionStatus(CONNECTED).generate()
        expect(items[1].type).to.equal('separator')
        expect(items[2].label).to.equal('Disconnect')
        expect(items[3].type).to.equal('separator')
        expect(items[4].label).to.equal('Show window')
        expect(items[5].label).to.equal('Toggle developer tools')
        expect(items[6].type).to.equal('separator')
        expect(items[7].label).to.equal('Quit')
      })

      it('sets status to connected', () => {
        const items = generator.updateConnectionStatus(CONNECTED).generate()
        expect(items[0].label).to.equal('Status: Connected')
      })

      it('sets status to disconnected', () => {
        const items = generator.updateConnectionStatus(DISCONNECTED).generate()
        expect(items[0].label).to.equal('Status: Disconnected')
      })

      it('sets status to connecting', () => {
        const items = generator.updateConnectionStatus(CONNECTING).generate()
        expect(items[0].label).to.equal('Status: Connecting')
      })

      it('sets status to disconnecting', () => {
        const items = generator.updateConnectionStatus(DISCONNECTING).generate()
        expect(items[0].label).to.equal('Status: Disconnecting')
      })

      it('connects', () => {
        generator.updateProposals([
          new ProposalDto({
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
        expect(window.isVisible).to.equal(false)
        items[4].click()
        expect(window.isVisible).to.equal(true)
      })

      it('quits app', () => {
        const items = generator.generate()
        expect(appQuitter.didQuit).to.equal(false)
        items[7].click()
        expect(appQuitter.didQuit).to.equal(true)
      })

      it('toggles developer tools', () => {
        const items = generator.generate()
        expect(window.devToolsOpen).to.equal(false)
        items[5].click()
        expect(window.devToolsOpen).to.equal(true)
        items[5].click()
        expect(window.devToolsOpen).to.equal(false)
      })
    })
  })
})
