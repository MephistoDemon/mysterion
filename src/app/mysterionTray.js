// @flow
import path from 'path'
import {Menu, Tray, app} from 'electron'
import {__static} from './electronEnv'

const TrayIcon = {
  active: 'active',
  passive: 'passive'
}

type IconState = $Values<typeof TrayIcon>

const iconFilenames = {
  [TrayIcon.active]: 'trayActiveTemplate.png',
  [TrayIcon.passive]: 'trayPassiveTemplate.png'
}

class MysterionTray {
  _toggleDevTools: ?Function
  _tray: Tray

  /**
   * @param toggleDevTools if passed, menu entry for toggling dev tools will be created
   */
  constructor (toggleDevTools: ?Function) {
    this._toggleDevTools = toggleDevTools
  }

  build () {
    const iconPath = this._getIconPath(TrayIcon.passive)
    this._tray = new Tray(iconPath)

    let menu = []

    menu.push({
      label: 'Quit',
      click: () => {
        app.quit()
      }
    })

    const toggleDevTools = this._toggleDevTools
    if (toggleDevTools != null) {
      menu = [{
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: () => {
          toggleDevTools()
        }
      }, ...menu]
    }

    this._tray.setToolTip('Mysterium')
    this._tray.setContextMenu(Menu.buildFromTemplate(menu))
  }

  setIcon (state: IconState) {
    const path = this._getIconPath(state)
    this._tray.setImage(path)
  }

  _getIconPath (state: IconState) {
    const filename = iconFilenames[state]
    return path.join(__static, 'icons', filename)
  }
}

export default MysterionTray
export { TrayIcon }
