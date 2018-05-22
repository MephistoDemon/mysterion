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

import {app} from 'electron'
import trayFactory from '../main/tray/factory'
import {logLevels as processLogLevels} from '../libraries/mysterium-client'
import translations from './messages'
import MainCommunication from './communication/main-communication'
import MainMessageBus from './communication/mainMessageBus'
import {onFirstEvent} from './communication/utils'
import path from 'path'
import ConnectionStatusEnum from '../libraries/mysterium-tequilapi/dto/connection-status-enum'

class Mysterion {
  constructor ({browserWindowFactory, windowFactory, config, terms, installer, monitoring, process, proposalFetcher, bugReporter, userSettingsPath, userSettingsPromise, disconnectNotification}) {
    Object.assign(this, {
      browserWindowFactory,
      windowFactory,
      config,
      terms,
      installer,
      monitoring,
      process,
      proposalFetcher,
      bugReporter,
      userSettingsPath,
      userSettingsPromise,
      disconnectNotification
    })
  }

  run () {
    this.logUnhandledRejections()

    // fired when app has been launched
    app.on('ready', async () => {
      await this.bootstrap()
      this.buildTray()
    })
    // fired when all windows are closed
    app.on('window-all-closed', () => this.onWindowsClosed())
    // fired just before quitting, this should quit
    app.on('will-quit', () => this.onWillQuit())
    // fired when app activated
    app.on('activate', () => {
      if (!this.window.exists()) {
        return this.bootstrap()
      }
      this.window.show()
    })
    app.on('before-quit', () => {
      this.window.willQuitApp = true
    })
  }

  logUnhandledRejections () {
    process.on('unhandledRejection', error => {
      console.log('Received unhandled rejection:', error)
    })
  }

  async bootstrap () {
    const showTerms = !this._areTermsAccepted()
    const browserWindow = this._createBrowserWindow()
    const windowSize = this._getWindowSize(showTerms)
    this.window = this._createWindow(windowSize)

    const send = this._getSendFunction(browserWindow)
    this.messageBus = new MainMessageBus(send, this.bugReporter.captureException)
    this.communication = new MainCommunication(this.messageBus)

    await this._onRendererLoaded()

    if (showTerms) {
      const accepted = await this._acceptTermsOrQuit()
      if (!accepted) {
        return
      }
    }

    await this._ensureDaemonInstallation()
    await this._startProcessAndMonitoring()
  }

  _getWindowSize (showTerms) {
    if (showTerms) {
      return this.config.windows.terms
    } else {
      return this.config.windows.app
    }
  }

  _areTermsAccepted () {
    try {
      this.terms.load()
      return this.terms.isAccepted()
    } catch (e) {
      this.bugReporter.captureException(e)
      return false
    }
  }

  _getSendFunction (browserWindow) {
    return browserWindow.webContents.send.bind(browserWindow.webContents)
  }

  _createBrowserWindow () {
    try {
      return this.browserWindowFactory()
    } catch (e) {
      console.error(e)
      this.bugReporter.captureException(e)
      throw new Error('Failed to open window.')
    }
  }

  _createWindow (size) {
    try {
      const window = this.windowFactory()
      window.resize(size)
      window.open()
      return window
    } catch (e) {
      console.error(e)
      this.bugReporter.captureException(e)
      throw new Error('Failed to open window.')
    }
  }

  async _onRendererLoaded () {
    try {
      await onFirstEvent(this.communication.onRendererBooted.bind(this.communication))
    } catch (e) {
      console.error(e)
      this.bugReporter.captureException(e)
      // TODO: add an error wrapper method
      throw new Error('Failed to load app.')
    }
  }

  // checks if daemon is installed or daemon file is expired
  // if the installation fails, it sends a message to the renderer window
  async _ensureDaemonInstallation () {
    if (this.installer.needsInstallation()) {
      try {
        await this.installer.install()
      } catch (e) {
        this.bugReporter.captureException(e)
        console.error(e)
        return this.communication.sendRendererShowErrorMessage(translations.daemonInstallationError)
      }
    }
  }

  onWindowsClosed () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  async onWillQuit () {
    this.monitoring.stop()
    this.proposalFetcher.stop()

    try {
      await this.process.stop()
    } catch (e) {
      console.error('Failed to stop mysterium_client process')
      this.bugReporter.captureException(e)
    }
  }

  // make sure terms are up to date and accepted
  // declining terms will quit the app
  async _acceptTermsOrQuit () {
    try {
      const accepted = await this._acceptTerms()
      if (!accepted) {
        console.log('Terms were refused. Quitting.')
        app.quit()
        return false
      }
    } catch (e) {
      this.bugReporter.captureException(e)
      this.communication.sendRendererShowErrorMessage(e.message)
      return false
    }
    return true
  }

  async _acceptTerms () {
    this.communication.sendTermsRequest({
      htmlContent: this.terms.getContent()
    })

    const termsAnsweredDTO = await onFirstEvent((callback) => {
      this.communication.onTermsAnswered(callback)
    })
    const termsAnswer = termsAnsweredDTO.isAccepted
    if (!termsAnswer) {
      return false
    }

    this.communication.sendTermsAccepted()

    try {
      this.terms.accept()
    } catch (e) {
      const error = new Error(translations.termsAcceptError)
      error.original = e
      console.error(error)
      throw error
    }

    this.window.resize(this.config.windows.app)

    return true
  }

  async _startProcessAndMonitoring () {
    const updateRendererWithHealth = () => {
      try {
        this.communication.sendHealthCheck({ isRunning: this.monitoring.isRunning() })
      } catch (e) {
        this.bugReporter.captureException(e)
        return
      }

      setTimeout(() => updateRendererWithHealth(), 1500)
    }
    const cacheLogs = (level, data) => {
      this.communication.sendMysteriumClientLog({level, data})
      this.bugReporter.pushToLogCache(level, data)
    }

    this.process.start()
    this.process.onLog(processLogLevels.LOG, (data) => cacheLogs(processLogLevels.LOG, data))
    this.process.onLog(processLogLevels.ERROR, (data) => cacheLogs(processLogLevels.ERROR, data))

    this.monitoring.start()
    this.monitoring.onProcessReady(() => {
      updateRendererWithHealth()
      this.startApp()
    })

    this.communication.onCurrentIdentityChange((identity) => {
      this.bugReporter.setUser(identity)
    })

    this.communication.onConnectionStatusChange(async (status) => {
      const userSettings = await this.userSettingsPromise
      if (userSettings.showDisconnectNotifications && status.newStatus === ConnectionStatusEnum.NOT_CONNECTED) {
        this.disconnectNotification.show()
      }
    })
  }

  /**
   * notifies the renderer that we're good to go and sets up the system tray
   */
  startApp () {
    this.proposalFetcher.subscribe((proposals) => this.communication.sendProposals(proposals))
    this.proposalFetcher.start()

    this.communication.onProposalUpdateRequest(async () => {
      this.communication.sendProposals(await this.proposalFetcher.fetch())
    })

    console.log(`Notify that 'mysterium_client' process is ready`)
    this.communication.sendMysteriumClientIsReady()
  }

  buildTray () {
    trayFactory(
      this.communication,
      this.proposalFetcher,
      this.window,
      path.join(this.config.staticDirectory, 'icons')
    )
  }
}

export default Mysterion
