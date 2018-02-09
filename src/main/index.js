'use strict'

import {app, BrowserWindow, Tray, Menu} from 'electron'
import path from 'path'
import config from './config'
import {Installer as MysteriumInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import TequilAPI from '../api/tequilapi'

config(global) // sets some global variables, path to mystClient binary etc
let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const tequilAPI = TequilAPI()
let mysteriumProcess = new MysteriumProcess(global.__mysteriumClientConfig, tequilAPI)

function startApplication () {
  mysteriumProcess.start()

  createWindow()
  createTray()
}

function createTray () {
  let trayIconPath = path.join(__static, 'icons', 'tray.png')
  tray = new Tray(trayIconPath)
  tray.setToolTip('Mysterium')
  // TODO: hide "Toggle DevTools" when not in development
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: function () {
        mainWindow.show()
        mainWindow.toggleDevTools()
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: (process.env.NODE_ENV === 'development') ? 1200 : 600,
    width: (process.env.NODE_ENV === 'development') ? 1200 : 500, // width for devtools, and suggested styles below
    resizable: process.env.NODE_ENV === 'development'
    // useContentSize: true,
    // frame: false,
    // titleBarStyle: 'hidden',
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async () => {
  let installer = new MysteriumInstaller(global.__mysteriumClientConfig)
  if (!installer.exists()) {
    installer.install()
      .then(startApplication)
      .catch((error) => {
        console.error(error)
        app.quit()
      })
  } else {
    startApplication()
  }
})

app.on('window-all-closed', () => {
  // OSX handles window closing differently than other OSs.
  // Closing a window doesn't mean closing the app
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  await mysteriumProcess.stop()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
