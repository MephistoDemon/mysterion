// @flow
import path from 'path'
import {Tray as ElectronTray} from 'electron'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'
import TrayMenuBuilder from './menu-builder'
import translations from './translations'
import ConnectionStatusEnum from '../../libraries/mysterium-tequilapi/dto/connection-status-enum'
import type {ConnectionStatus} from '../../libraries/mysterium-tequilapi/dto/connection-status-enum'

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
  _canUpdateItems: boolean = true
  _connectionStatus: ConnectionStatus
  _iconPath: string

  constructor (trayFactory: electronTrayFactory, templateBuilder: Function, menuBuilder: TrayMenuBuilder, imagePath: string) {
    this._electronTrayFactory = trayFactory
    this._templateBuilder = templateBuilder
    this._menuBuilder = menuBuilder
    this._iconPath = imagePath
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

  setStatus (status: ConnectionStatus) {
    if (this._connectionStatus === status) {
      return
    }

    this._connectionStatus = status

    switch (status) {
      case ConnectionStatusEnum.CONNECTED:
        this._setIcon(TrayIcon.active)
        break
      case ConnectionStatusEnum.NOT_CONNECTED:
      case ConnectionStatusEnum.CONNECTING:
      case ConnectionStatusEnum.DISCONNECTING:
        this._setIcon(TrayIcon.passive)
        break
      default:
        this._setIcon(TrayIcon.passive)
        break
    }

    this._menuBuilder.updateConnectionStatus(status)
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
    this._electronTray.setImage(this._getIconPath(state))

    return this
  }

  _getIconPath (state: IconState): string {
    return path.join(this._iconPath, iconFilenames[state])
  }
}

export default Tray
export {TrayIcon}
