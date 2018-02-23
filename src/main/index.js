'use strict'

import {app, BrowserWindow, Tray, Menu} from 'electron'
import path from 'path'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'
import config from './config'
import {Installer as MysteriumInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import TequilAPI from '../api/tequilapi'

import bugReporter from './bug-reporting'

const raven = bugReporter.installInMain()
config(global) // sets some global variables, path to mystClient binary etc
let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const tequilAPI = TequilAPI()
let mysteriumProcess = new MysteriumProcess(global.__mysteriumClientConfig, tequilAPI)
let processMonitoring = new ProcessMonitoring(tequilAPI)

async function startApplication () {
  try {
    await mysteriumProcess.start()
  } catch (err) {
    console.log('touched the daemon, now he woke up')
  } finally {
    processMonitoring.start()
  }
  createWindow()
  createTray()
}

function createTray () {
  let trayIconPath = path.join(__static, 'icons', 'tray.png')
  tray = new Tray(trayIconPath)
  tray.setToolTip('Mysterium')
  let template = [
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    }
  ]
  template.unshift({
    label: 'Toggle DevTools',
    accelerator: 'Alt+Command+I',
    click: function () {
      mainWindow.show()
      mainWindow.toggleDevTools()
    }
  })
  const contextMenu = Menu.buildFromTemplate(template)
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
  mainWindow.on('unresponsive', () => {
    raven.captureException(new Error('Renderer is unresponsive'))
  })
}

app.on('ready', async () => {
  let installer = new MysteriumInstaller(global.__mysteriumClientConfig)
  if (!installer.exists()) {
    try {
      await installer.install()
    } catch (err) {
      console.error(err)
    }
  }
  startApplication()
})

app.on('window-all-closed', () => {
  // OSX handles window closing differently than other OSs.
  // closing a window doesn't mean closing the app
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', async () => {
  processMonitoring.stop()
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