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
import MainMessageBusCommunication from './communication/main-message-bus-communication'
import MainMessageBus from './communication/mainMessageBus'
import {onFirstEvent} from './communication/utils'
import path from 'path'
import ConnectionStatusEnum from '../libraries/mysterium-tequilapi/dto/connection-status-enum'
import logger from './logger'

const LOG_PREFIX = '[Mysterion] '

class Mysterion {
  constructor ({ browserWindowFactory, windowFactory, config, terms, installer, monitoring, process, proposalFetcher, bugReporter, userSettingsStore, disconnectNotification }) {
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
      userSettingsStore,
      disconnectNotification
    })
  }

  run () {
    this.logUnhandledRejections()

    // fired when app has been launched
    app.on('ready', async () => {
      try {
        logInfo('Application launch')
        await this.bootstrap()
        this.buildTray()
      } catch (e) {
        logException('Application launch failed', e)
        this.bugReporter.captureException(e)
      }
    })
    // fired when all windows are closed
    app.on('window-all-closed', () => this.onWindowsClosed())
    // fired just before quitting, this should quit
    app.on('will-quit', () => this.onWillQuit())
    // fired when app activated
    app.on('activate', () => {
      try {
        logInfo('Application activate')
        if (!this.window.exists()) {
          this.bootstrap()
          return
        }
        this.window.show()
      } catch (e) {
        logException('Application activate failed', e)
        this.bugReporter.captureException(e)
      }
    })
    app.on('before-quit', () => {
      this.window.willQuitApp = true
    })
  }

  logUnhandledRejections () {
    process.on('unhandledRejection', error => {
      logger.info('Received unhandled rejection:', error)
    })
  }

  async bootstrap () {
    const showTerms = !this._areTermsAccepted()
    const browserWindow = this._createBrowserWindow()
    const windowSize = this._getWindowSize(showTerms)
    this.window = this._createWindow(windowSize)

    const send = this._getSendFunction(browserWindow)
    this.messageBus = new MainMessageBus(send, this.bugReporter.captureException)
    this.communication = new MainMessageBusCommunication(this.messageBus)
    this.communication.onCurrentIdentityChange((identity) => {
      this.bugReporter.setUser(identity)
    })

    await this._onRendererLoaded()

    if (showTerms) {
      const accepted = await this._acceptTermsOrQuit()
      if (!accepted) {
        return
      }
      this.window.resize(this._getWindowSize(false))
    }

    await this._ensureDaemonInstallation()
    await this._startProcessAndMonitoring()

    await this._loadUserSettings()
  }

  _getWindowSize (showTerms) {
    if (showTerms) {
      return this.config.windows.terms
    } else {
      return this.config.windows.app
    }
  }

  _areTermsAccepted () {
    logInfo('Checking terms cache')
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
      // TODO: add an error wrapper method
      throw new Error('Failed to open browser window. ' + e)
    }
  }

  _createWindow (size) {
    logInfo('Opening window')
    try {
      const window = this.windowFactory()
      window.resize(size)
      window.open()
      return window
    } catch (e) {
      // TODO: add an error wrapper method
      throw new Error('Failed to open window. ' + e)
    }
  }

  async _onRendererLoaded () {
    logInfo('Waiting for window to be rendered')
    try {
      await onFirstEvent(this.communication.onRendererBooted.bind(this.communication))
    } catch (e) {
      // TODO: add an error wrapper method
      throw new Error('Failed to load app. ' + e)
    }
  }

  // checks if daemon is installed or daemon file is expired
  // if the installation fails, it sends a message to the renderer window
  async _ensureDaemonInstallation () {
    if (this.installer.needsInstallation()) {
      logInfo("Installing 'mysterium_client' process")
      try {
        await this.installer.install()
      } catch (e) {
        this.communication.sendRendererShowErrorMessage(translations.daemonInstallationError)
        throw new Error("Failed to install 'mysterium_client' process. " + e)
      }
    }
  }

  async _loadUserSettings () {
    try {
      await this.userSettingsStore.load()
    } catch (e) {
      this.bugReporter.captureInfoException(e)
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
      logException("Failed to stop 'mysterium_client' process", e)
      this.bugReporter.captureException(e)
    }
  }

  // make sure terms are up to date and accepted
  // declining terms will quit the app
  async _acceptTermsOrQuit () {
    logInfo('Accepting terms')
    try {
      const accepted = await this._acceptTerms()
      if (!accepted) {
        logInfo('Terms were refused. Quitting.')
        app.quit()
        return false
      }
    } catch (e) {
      this.communication.sendRendererShowErrorMessage(e.message)
      throw new Error('Failed to accept terms. ' + e)
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
      throw error
    }
    return true
  }

  _startProcessAndMonitoring () {
    const cacheLogs = (level, data) => {
      this.communication.sendMysteriumClientLog({ level, data })
      this.bugReporter.pushToLogCache(level, data)
    }

    logInfo("Starting 'mysterium_client' process")
    this.process.start()
    this.process.onLog(processLogLevels.LOG, (data) => cacheLogs(processLogLevels.LOG, data))
    this.process.onLog(processLogLevels.ERROR, (data) => cacheLogs(processLogLevels.ERROR, data))

    logInfo("Starting 'mysterium_client' monitoring")
    this.monitoring.start()
    this.monitoring.subscribeStatus((isRunning) => {
      this.communication.sendHealthCheck({ isRunning: isRunning })
    })
    this.monitoring.onProcessReady(() => {
      this.updateProposalsLoop()
      this.startApp()
    })

    synchronizeUserSettings(this.userSettingsStore, this.communication)
    showNotificationOnDisconnect(this.userSettingsStore, this.communication, this.disconnectNotification)
  }

  updateProposalsLoop () {
    logInfo("Subscribing 'mysterium_client' proposals")
    this.proposalFetcher.subscribe((proposals) => this.communication.sendProposals(proposals))
    this.proposalFetcher.start()

    this.communication.onProposalUpdateRequest(async () => {
      this.communication.sendProposals(await this.proposalFetcher.fetch())
    })
  }

  /**
   * notifies the renderer that we're good to go and sets up the system tray
   */
  startApp () {
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

function showNotificationOnDisconnect (userSettingsStore, communication, disconnectNotification) {
  communication.onConnectionStatusChange(async (status) => {
    const shouldShowNotification =
      userSettingsStore.get().showDisconnectNotifications &&
      (status.newStatus === ConnectionStatusEnum.NOT_CONNECTED &&
        status.oldStatus === ConnectionStatusEnum.CONNECTED)

    if (shouldShowNotification) {
      disconnectNotification.show()
    }
  })
}

function synchronizeUserSettings (userSettingsStore, communication) {
  communication.onUserSettingsRequest(async () => {
    communication.sendUserSettings(userSettingsStore.get())
  })

  communication.onUserSettingsUpdate((userSettings) => {
    userSettingsStore.set(userSettings)
    userSettingsStore.save()
  })
}

function logInfo (message) {
  logger.info(LOG_PREFIX + message)
}

function logException (message, err) {
  logger.error(LOG_PREFIX + message, err)
}

export default Mysterion
