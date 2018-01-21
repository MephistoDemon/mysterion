'use strict'

import { app, BrowserWindow, Tray, Menu } from 'electron'
import path from 'path'
import config from './config'
import mystClient from './mystProcess'
import state from '../renderer/store'

config(global)  // sets some global variables, path to mystClient binary etc

let mystProcess
let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

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
    height: 500,
    width: 1000 // width for devtools, and suggested styles below
    // useContentSize: true,
    // frame: false,
    // titleBarStyle: 'hidden',
    // resizable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  createTray()
  mystProcess = mystClient.spawn()
  routeLogsFromMystClientToState(mystProcess, state)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  mystProcess.kill('SIGTERM')
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function routeLogsFromMystClientToState (mystProcess, state) {
  mystProcess.stdout.on('data', (data) => {
    state.commit('LOG_INFO', data)
  })
  mystProcess.stderr.on('data', (data) => {
    state.commit('LOG_ERROR', data)
  })
  mystProcess.on('close', (data) => {
    state.commit('MYST_PROCESS_CLOSE', data)
  })
}

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
