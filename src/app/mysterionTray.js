// @flow
import path from 'path'
import {Menu, Tray, app} from 'electron'
import Window from './window'

declare var __static: string

class MysterionTray {
  window: Window
  inDevMode: boolean

  constructor (window: Window, inDevMode: boolean) {
    this.inDevMode = inDevMode
    this.window = window
  }

  build () {
    const trayIconPath = path.join(__static, 'icons', 'tray-passiveTemplate.png')
    const tray = new Tray(trayIconPath)

    let menu = []

    menu.push({
      label: 'Quit',
      click: () => {
        app.quit()
      }
    })

    if (this.inDevMode) {
      menu = [{
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: () => {
          this.window.toggleDevTools()
        }
      }, ...menu]
    }

    tray.setToolTip('Mysterium')
    tray.setContextMenu(Menu.buildFromTemplate(menu))
  }
}

export default MysterionTray
