// @flow

import ProposalDto from '../../libraries/api/client/dto/proposal'
import connectionStatus from '../../libraries/api/connectionStatus'
import MainCommunication from '../../app/communication/main-communication'
import ProposalFetcher from '../../app/data-fetchers/proposal-fetcher'
import Window from '../../app/window'
import TrayMenuGenerator, {CONNECTED, CONNECTING, DISCONNECTED, DISCONNECTING} from './menu-generator'
import Tray, {TrayIcon} from './tray'

class TrayBuilder {
  _appQuitter: Function
  _window: Window
  _communication: MainCommunication
  _proposalFetcher: ProposalFetcher

  _statusMap: Object = {
    [connectionStatus.CONNECTED]: CONNECTED,
    [connectionStatus.NOT_CONNECTED]: DISCONNECTED,
    [connectionStatus.CONNECTING]: CONNECTING,
    [connectionStatus.DISCONNECTING]: DISCONNECTING
  }

  _connectionStatus: string
  _tray: Tray
  _menuGenerator: TrayMenuGenerator

  constructor (appQuitter: Function, window: Window, communication: MainCommunication, proposalFetcher: ProposalFetcher) {
    this._appQuitter = appQuitter
    this._window = window
    this._communication = communication
    this._proposalFetcher = proposalFetcher
  }

  build () {
    this._menuGenerator = new TrayMenuGenerator(this._appQuitter, this._window, this._communication)
    this._tray = (new Tray(this._menuGenerator)).build()

    this._communication.onConnectionStatusChange((statuses) => this._updateStatus(statuses))
    this._menuGenerator.onUpdate(() => this._tray.update())

    let canUpdateTrayItems: boolean = false

    this._tray.onOpen(() => {
      canUpdateTrayItems = false
    }).onClose(() => {
      canUpdateTrayItems = true
    })

    this._proposalFetcher.subscribe((proposals: Array<ProposalDto>) => {
      // do not re-render tray when it's open or it will close
      if (canUpdateTrayItems) {
        this._menuGenerator.updateProposals(proposals)
      }
    })
  }

  _updateStatus (status: { oldStatus: string, newStatus: string }) {
    if (this._connectionStatus === status.newStatus) {
      return
    }

    this._connectionStatus = status.newStatus

    let trayStatus = this._statusMap[this._connectionStatus]
      ? this._statusMap[this._connectionStatus]
      : DISCONNECTED

    switch (trayStatus) {
      case CONNECTED:
        this._tray.setIcon(TrayIcon.active)
        break
      case DISCONNECTED:
      case CONNECTING:
      case DISCONNECTING:
        this._tray.setIcon(TrayIcon.passive)
        break
    }

    this._menuGenerator.updateConnectionStatus(trayStatus)
  }
}

export default TrayBuilder
