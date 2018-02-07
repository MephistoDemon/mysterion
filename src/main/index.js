'use strict'

import {app, BrowserWindow, Tray, Menu} from 'electron'
import path from 'path'
import config from './config'
import {Config as MysteriumConfig, Installer as MysteriumInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import tequilAPI from '../api/tequilapi'

config(global) // sets some global variables, path to mystClient binary etc
let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const mysteriumConfig = new MysteriumConfig(
  global.__mysteriumClientBin,
  app.getPath('temp'),
  app.getPath('userData')
)

function startApplication () {
  let process = new MysteriumProcess(mysteriumConfig, tequilAPI())
  process.start()

  createWindow()
  createTray()
}

function createTray () {
  let trayIconPath = path.join(__static, 'icons', 'tray.png')
  tray = new Tray(trayIconPath)
  tray.setToolTip('Mysterium')
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
    height: 600,
    width: (process.env.NODE_ENV === 'development') ? 1200 : 500, // width for devtools, and suggested styles below
    resizable: false
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
  let intaller = new MysteriumInstaller(mysteriumConfig)
  if (!intaller.exists()) {
    intaller.install()
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // mystProcess.kill('SIGTERM')
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
