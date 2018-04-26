// @flow

import ProposalDto from '../../libraries/api/client/dto/proposal'
import Window from '../../app/window'
import MainCommunication from '../../app/communication/main-communication'
import {getCountryNameFromProposal} from '../../app/countries/index'
import TrayMenu from './menu'
import TrayMenuItem from './menu-item'
import TrayMenuSeparator from './menu-item-separator'
import translations from './translations'

const CONNECTED = 'CONNECTED'
const DISCONNECTED = 'DISCONNECTED'
const CONNECTING = 'CONNECTING'
const DISCONNECTING = 'DISCONNECTING'

type Status = typeof CONNECTED | typeof CONNECTING | typeof DISCONNECTED | typeof DISCONNECTING

function GenerateMenuItems (
  applicationQuitter: Function,
  window: Window,
  communication: MainCommunication,
  proposals: Array<ProposalDto>,
  connectionStatus: Status) {
  const disconnect = new TrayMenuItem(
    translations.disconnect,
    () => {
      communication.sendConnectionCancelRequest()
    }
  )

  const connectSubmenu = new TrayMenu()
  proposals.forEach((proposal: ProposalDto) => {
    connectSubmenu.add(getCountryNameFromProposal(proposal), () => {
      communication.sendConnectionRequest({providerId: proposal.providerId})
    })
  })

  const connect = new TrayMenuItem(
    translations.connect,
    null,
    null,
    connectSubmenu
  )

  const statusItem = (new TrayMenuItem(translations.statusDisconnected)).disable()

  const items = new TrayMenu()
  items.addItem(statusItem)
  items.addItem(new TrayMenuSeparator())
  items.addItem(connect)
  items.addItem(disconnect.hide())
  items.addItem(new TrayMenuSeparator())
  items.add(translations.showWindow, () => window.show())
  items.add(translations.toggleDeveloperTools, () => window.toggleDevTools(), 'Alt+Command+I')
  items.addItem(new TrayMenuSeparator())
  items.add(translations.quit, () => applicationQuitter(), 'Command+Q')

  switch (connectionStatus) {
    case DISCONNECTED:
      connect.show()
      disconnect.hide()
      statusItem.setLabel(translations.statusDisconnected)
      break

    case CONNECTED:
      connect.hide()
      disconnect.show()
      statusItem.setLabel(translations.statusConnected)
      break

    case CONNECTING:
      connect.hide()
      disconnect.hide()
      statusItem.setLabel(translations.statusConnecting)
      break

    case DISCONNECTING:
      connect.hide()
      disconnect.hide()
      statusItem.setLabel(translations.statusDisconnecting)
      break
  }

  return items.getItems()
}

class TrayMenuGenerator {
  _applicationQuitter: Function
  _window: Window
  _communication: MainCommunication
  _proposals: Array<ProposalDto> = []
  _listeners: Array<Function> = []
  _connectionStatus: Status

  constructor (applicationQuitter: Function, window: Window, communication: MainCommunication) {
    this._applicationQuitter = applicationQuitter
    this._window = window
    this._communication = communication
  }

  updateProposals (proposals: Array<ProposalDto>): this {
    this._proposals = proposals
    this._runListeners()

    return this
  }

  updateConnectionStatus (status: Status): this {
    this._connectionStatus = status
    this._runListeners()

    return this
  }

  onUpdate (callback: Function): this {
    this._listeners.push(callback)

    return this
  }

  generate (): Array<Object> {
    return GenerateMenuItems(
      this._applicationQuitter,
      this._window,
      this._communication,
      this._proposals,
      this._connectionStatus
    )
  }

  _runListeners (): void {
    this._listeners.forEach((callback: Function) => {
      callback()
    })
  }
}

export default TrayMenuGenerator
export {
  CONNECTED,
  DISCONNECTED,
  CONNECTING,
  DISCONNECTING
}
