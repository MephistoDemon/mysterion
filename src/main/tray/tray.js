// @flow
import path from 'path'
import {__static} from '../../app/electronEnv'
import {Menu, Tray as ElectronTray} from 'electron'
import TrayMenuGenerator from './menu-generator'

const TrayIcon = {
  active: 'active',
  passive: 'passive'
}

type IconState = $Values<typeof TrayIcon>

const iconFilenames = {
  [TrayIcon.active]: 'trayActiveTemplate.png',
  [TrayIcon.passive]: 'trayPassiveTemplate.png'
}

class Tray {
  _tray: ElectronTray
  _generator: TrayMenuGenerator

  constructor (generator: TrayMenuGenerator) {
    this._generator = generator
  }

  onOpen (clickHandler: Function) {
    this._tray.on('click', () => {
      clickHandler()
    })

    this._tray.on('mouse-enter', () => {
      clickHandler()
    })

    return this
  }

  onClose (leaveHandler: Function) {
    this._tray.on('mouse-leave', () => {
      leaveHandler()
    })

    return this
  }

  build (): this {
    const iconPath = this._getIconPath(TrayIcon.passive)
    this._tray = new ElectronTray(iconPath)
    this._tray.setToolTip('Mysterium')
    this._tray.setContextMenu(Menu.buildFromTemplate(this._generator.generate()))

    return this
  }

  update (): this {
    this._tray.setContextMenu(Menu.buildFromTemplate(this._generator.generate()))

    return this
  }

  setIcon (state: IconState): this {
    const path = this._getIconPath(state)
    this._tray.setImage(path)

    return this
  }

  _getIconPath (state: IconState): string {
    const filename = iconFilenames[state]

    return path.join(__static, 'icons', filename)
  }
}

export default Tray
export {TrayIcon}
