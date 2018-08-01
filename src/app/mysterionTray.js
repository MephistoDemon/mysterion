/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import path from 'path'
import { Menu, Tray, app } from 'electron'
import { __static } from './electronEnv'

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
  _activateWindow: Function
  _toggleDevTools: ?Function
  _tray: Tray

  /**
   * @param toggleDevTools if passed, menu entry for toggling dev tools will be created
   */
  constructor (activateWindow: Function, toggleDevTools: ?Function) {
    this._activateWindow = activateWindow
    this._toggleDevTools = toggleDevTools
  }

  build () {
    const iconPath = this._getIconPath(TrayIcon.passive)
    this._tray = new Tray(iconPath)

    let menu = []
    menu.push({
      label: 'Show main view',
      click: this._activateWindow
    })

    const toggleDevTools = this._toggleDevTools
    if (toggleDevTools != null) {
      menu.push({
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: toggleDevTools
      })
    }

    menu.push({
      label: 'Quit',
      click: () => {
        app.quit()
      }
    })

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
