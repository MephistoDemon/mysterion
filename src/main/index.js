'use strict'

import {app, BrowserWindow, Tray, Menu} from 'electron'
import os from 'os'
import path from 'path'
import config from './config'
import Daemon from '../libraries/osx/daemon'
import http from 'http'

config(global) // sets some global variables, path to mystClient binary etc
let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function startApplication () {
  // hack to spawn mysterium_client before the window is rendered
  http.get('http://127.0.0.1:4050', function () {})

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
  let daemon = new Daemon(
    app.getPath('temp'),
    app.getPath('userData'),
    global.__mysteriumClientBin
  )

  if (!daemon.exists()) {
    daemon.install()
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
