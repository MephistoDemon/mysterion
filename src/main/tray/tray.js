// @flow
import path from 'path'
import {Tray as ElectronTray} from 'electron'
import ProposalDTO from '../../libraries/api/client/dto/proposal'
import connectionStatus from '../../libraries/api/connectionStatus'
import TrayMenuBuilder, {CONNECTED, CONNECTING, DISCONNECTED, DISCONNECTING} from './menu-builder'
import translations from './translations'

const TrayIcon = {
  active: 'active',
  passive: 'passive'
}

type IconState = $Values<typeof TrayIcon>

const iconFilenames = {
  [TrayIcon.active]: 'trayActiveTemplate.png',
  [TrayIcon.passive]: 'trayPassiveTemplate.png'
}

type electronTrayFactory = (iconPath: string) => ElectronTray

class Tray {
  _electronTrayFactory: electronTrayFactory
  _electronTray: ElectronTray
  _menuBuilder: TrayMenuBuilder
  _templateBuilder: Function
  _statusMap: Object = {
    [connectionStatus.CONNECTED]: CONNECTED,
    [connectionStatus.NOT_CONNECTED]: DISCONNECTED,
    [connectionStatus.CONNECTING]: CONNECTING,
    [connectionStatus.DISCONNECTING]: DISCONNECTING
  }
  _canUpdateItems: boolean = true
  _connectionStatus: string

  constructor (trayFactory: electronTrayFactory, templateBuilder: Function, menuBuilder: TrayMenuBuilder) {
    this._electronTrayFactory = trayFactory
    this._templateBuilder = templateBuilder
    this._menuBuilder = menuBuilder
  }

  build (): this {
    this._electronTray = this._electronTrayFactory(this._getIconPath(TrayIcon.passive))
    this._electronTray.setToolTip(translations.name)
    this._electronTray.setContextMenu(this._templateBuilder(this._menuBuilder.build()))
    this._setupOpeningEvents()

    return this
  }

  _update (): this {
    this._electronTray.setContextMenu(this._templateBuilder(this._menuBuilder.build()))

    return this
  }

  setProposals (proposals: Array<ProposalDTO>) {
    if (!this._canUpdateItems) {
      return
    }

    this._menuBuilder.updateProposals(proposals)
    this._update()
  }

  setStatus (status: string) {
    if (this._connectionStatus === status) {
      return
    }

    this._connectionStatus = status

    let trayStatus = this._statusMap[status]
      ? this._statusMap[status]
      : DISCONNECTED

    switch (trayStatus) {
      case CONNECTED:
        this._setIcon(TrayIcon.active)
        break
      case DISCONNECTED:
      case CONNECTING:
      case DISCONNECTING:
        this._setIcon(TrayIcon.passive)
        break
    }

    this._menuBuilder.updateConnectionStatus(trayStatus)
    this._update()
  }

  _setupOpeningEvents () {
    const handler = () => {
      this._canUpdateItems = false
    }

    this._electronTray.on('click', handler)
    this._electronTray.on('mouse-enter', handler)
    this._electronTray.on('mouse-leave', () => {
      this._canUpdateItems = true
    })
  }

  _setIcon (state: IconState): this {
    const path = this._getIconPath(state)

    this._electronTray.setImage(path)

    return this
  }

  _getIconPath (state: IconState): string {
    const filename = iconFilenames[state]

    return path.join(__static, 'icons', filename)
  }
}

export default Tray
export {TrayIcon}
