// @flow

import {app as electronApp} from 'electron'
import ProposalDto from '../../libraries/api/client/dto/proposal'
import MainCommunication from '../communication/main-communication'
import {getCountryNameFromProposal} from '../countries'
import TrayMenu from './menu'
import TrayMenuItem from './menu-item'
import Window from '../window'
import TrayMenuSeparator from './menu-item-separator'

const CONNECTED = 'CONNECTED'
const DISCONNECTED = 'DISCONNECTED'
const CONNECTING = 'CONNECTING'
const DISCONNECTING = 'DISCONNECTING'

type Status = typeof CONNECTED | typeof CONNECTING | typeof DISCONNECTED | typeof DISCONNECTING

/**
 * Generates menu items
 *
 * @param app
 * @param window
 * @param communication
 * @param proposals
 * @param connectionStatus
 *
 * @returns {{label, click, accelerator, submenu}[]}
 *
 * @constructor
 */
function GenerateMenuItems (
  app: electronApp,
  window: Window,
  communication: MainCommunication,
  proposals: Array<ProposalDto>,
  connectionStatus: Status) {
  const disconnect = new TrayMenuItem(
    'Disconnect',
    () => {
      communication.sendDisconnectionRequest()
    }
  )

  const connectSubmenu = new TrayMenu()
  proposals.forEach((proposal: ProposalDto) => {
    connectSubmenu.add(getCountryNameFromProposal(proposal), () => {
      communication.sendConnectionRequest({providerId: proposal.providerId})
    })
  })

  const connect = new TrayMenuItem(
    'Connect',
    null,
    null,
    connectSubmenu
  )

  const statusItem = (new TrayMenuItem('Status: Disconnected')).disable()

  const items = new TrayMenu()
  items.addItem(statusItem)
  items.addItem(new TrayMenuSeparator())
  items.addItem(connect)
  items.addItem(disconnect.hide())
  items.addItem(new TrayMenuSeparator())
  items.add('Show window', () => window.show())
  items.add('Toggle developer tools', () => window.toggleDevTools(), 'Alt+Command+I')
  items.addItem(new TrayMenuSeparator())
  items.add('Quit', () => app.quit())

  switch (connectionStatus) {
    case DISCONNECTED:
      connect.show()
      disconnect.hide()
      statusItem.setLabel('Status: Disconnected')
      break

    case CONNECTED:
      connect.hide()
      disconnect.show()
      statusItem.setLabel('Status: Connected')
      break

    case CONNECTING:
      connect.hide()
      disconnect.hide()
      statusItem.setLabel('Status: Connecting')
      break

    case DISCONNECTING:
      connect.hide()
      disconnect.hide()
      statusItem.setLabel('Status: Disconnecting')
      break
  }

  return items.getItems()
}

class TrayMenuGenerator {
  _electron: electronApp
  _window: Window
  _communication: MainCommunication
  _proposals: Array<ProposalDto> = []
  _listeners: Array<Function> = []
  _connectionStatus: Status

  /**
   * @param electron
   * @param window
   * @param communication
   */
  constructor (electron: electronApp, window: Window, communication: MainCommunication) {
    this._electron = electron
    this._window = window
    this._communication = communication
  }

  /**
   * @param proposals
   *
   * @returns {TrayMenuGenerator}
   */
  updateProposals (proposals: Array<ProposalDto>): this {
    this._proposals = proposals
    this._runListeners()

    return this
  }

  /**
   * @param status
   *
   * @returns {TrayMenuGenerator}
   */
  updateConnectionStatus (status: Status): this {
    this._connectionStatus = status
    this._runListeners()

    return this
  }

  /**
   * @param callback
   *
   * @returns {TrayMenuGenerator}
   */
  onUpdate (callback: Function): this {
    this._listeners.push(callback)

    return this
  }

  /**
   * @returns {{label, click, accelerator, submenu}[]}
   */
  generate (): Array<Object> {
    return GenerateMenuItems(
      this._electron,
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
