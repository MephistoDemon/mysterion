import path from 'path'
import {Menu, Tray, app} from 'electron'

class MysterionTray {
  constructor (window, inDevMode) {
    this.inDevMode = inDevMode
    this.window = window
  }

  show () {
    const trayIconPath = path.join(__static, 'icons', 'tray-passiveTemplate.png')
    this.tray = new Tray(trayIconPath)

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

    this.tray.setToolTip('Mysterium')
    this.tray.setContextMenu(Menu.buildFromTemplate(menu))
  }
}

export default MysterionTray
