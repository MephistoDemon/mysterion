// @flow

import {app as electron} from 'electron'
import ProposalDto from '../../libraries/api/client/dto/proposal'
import connectionStatus from '../../libraries/api/connectionStatus'
import MainCommunication from '../communication/main-communication'
import ProposalFetcher from '../data-fetchers/proposal-fetcher'
import Window from '../window'
import TrayMenuGenerator, {CONNECTED, CONNECTING, DISCONNECTED, DISCONNECTING} from './item-generator'
import Tray, {TrayIcon} from './tray'

class TrayBuilder {
  _app: electron
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

  constructor (app: electron, window: Window, communication: MainCommunication, proposalFetcher: ProposalFetcher) {
    this._app = app
    this._window = window
    this._communication = communication
    this._proposalFetcher = proposalFetcher
  }

  build () {
    this._menuGenerator = new TrayMenuGenerator(this._app, this._window, this._communication)
    this._tray = (new Tray(this._menuGenerator)).build()

    this._communication.onConnectionStatusChange((statuses) => this._updateStatus(statuses))
    this._menuGenerator.onUpdate(() => this._tray.update())

    let trayIsOpen: boolean = false

    this._tray.onOpen(() => {
      trayIsOpen = true
    }).onClose(() => {
      trayIsOpen = false
    })

    this._proposalFetcher.subscribe((proposals: Array<ProposalDto>) => {
      if (!trayIsOpen) {
        this._menuGenerator.updateProposals(proposals)
      }
    })
  }

  _updateStatus (status: {oldStatus: string, newStatus: string}) {
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
