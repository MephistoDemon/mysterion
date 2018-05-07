// @flow

import ProposalDTO from '../../libraries/api/client/dto/proposal'
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

function GetMenuItems (
  appQuit: Function,
  showWindow: Function,
  toggleDevTools: Function,
  communication: MainCommunication,
  proposals: Array<ProposalDTO>,
  connectionStatus: Status) {
  const disconnect = new TrayMenuItem(
    translations.disconnect,
    () => communication.sendConnectionCancelRequest()
  )

  const connectSubmenu = new TrayMenu()
  proposals.forEach((proposal: ProposalDTO) => {
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
  items.add(translations.showWindow, () => showWindow())
  items.add(translations.toggleDeveloperTools, () => toggleDevTools(), 'Alt+Command+I')
  items.addItem(new TrayMenuSeparator())
  items.add(translations.quit, () => appQuit(), 'Command+Q')

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

class TrayMenuBuilder {
  _appQuit: Function
  _showWindow: Function
  _toggleDevTools: Function
  _communication: MainCommunication
  _proposals: Array<ProposalDTO> = []
  _connectionStatus: Status

  constructor (appQuit: Function, showWindow: Function, toggleDevTools: Function, communication: MainCommunication) {
    this._appQuit = appQuit
    this._showWindow = showWindow
    this._toggleDevTools = toggleDevTools
    this._communication = communication
  }

  updateProposals (proposals: Array<ProposalDTO>): this {
    this._proposals = proposals

    return this
  }

  updateConnectionStatus (status: Status): this {
    this._connectionStatus = status

    return this
  }

  build (): Array<Object> {
    return GetMenuItems(
      this._appQuit,
      this._showWindow,
      this._toggleDevTools,
      this._communication,
      this._proposals,
      this._connectionStatus
    )
  }
}

export default TrayMenuBuilder
export {
  CONNECTED,
  DISCONNECTED,
  CONNECTING,
  DISCONNECTING
}
