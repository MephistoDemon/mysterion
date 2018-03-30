// @flow
import path from 'path'
import {Menu, Tray, app} from 'electron'

declare var __static: string

const activeIconFilename: string = 'trayActiveTemplate.png'
const passiveIconFilename: string = 'trayPassiveTemplate.png'

class MysterionTray {
  _toggleDevTools: Function
  _allowDevTools: boolean
  _tray: Tray

  constructor (toggleDevTools: Function, allowDevTools: boolean) {
    this._toggleDevTools = toggleDevTools
    this._allowDevTools = allowDevTools
  }

  build () {
    const iconPath = this._getIconPath(passiveIconFilename)
    this._tray = new Tray(iconPath)

    let menu = []

    menu.push({
      label: 'Quit',
      click: () => {
        app.quit()
      }
    })

    if (this._allowDevTools) {
      menu = [{
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: () => {
          this._toggleDevTools()
        }
      }, ...menu]
    }

    this._tray.setToolTip('Mysterium')
    this._tray.setContextMenu(Menu.buildFromTemplate(menu))
  }

  setActiveState () {
    this._setIcon(activeIconFilename)
  }

  setPassiveState () {
    this._setIcon(passiveIconFilename)
  }

  _setIcon (filename: string) {
    const path = this._getIconPath(filename)
    this._tray.setImage(path)
  }

  _getIconPath (filename: string): string {
    return path.join(__static, 'icons', filename)
  }
}

export default MysterionTray
