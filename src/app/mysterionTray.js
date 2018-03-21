// @flow
import path from 'path'
import {Menu, Tray, app} from 'electron'
import Window from './window'

declare var __static: string

const activeIconFilename: string = 'tray-activeTemplate.png'
const passiveIconFilename: string = 'tray-passiveTemplate.png'

class MysterionTray {
  window: Window
  allowDevTools: boolean
  _tray: Tray

  constructor (window: Window, allowDevTools: boolean) {
    this.allowDevTools = allowDevTools
    this.window = window
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

    if (this.allowDevTools) {
      menu = [{
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: () => {
          this.window.toggleDevTools()
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
