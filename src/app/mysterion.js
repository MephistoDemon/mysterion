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

import { app, BrowserWindow } from 'electron'
import type { Installer, Process } from '../libraries/mysterium-client'
import { logLevels as processLogLevels } from '../libraries/mysterium-client'
import trayFactory from '../main/tray/factory'
import { SUDO_PROMT_PERMISSION_DENIED } from '../libraries/mysterium-client/launch-daemon/launch-daemon-installer'
import translations from './messages'
import MainMessageBusCommunication from './communication/main-message-bus-communication'
import { onFirstEvent, onFirstEventOrTimeout } from './communication/utils'
import path from 'path'
import ConnectionStatusEnum from '../libraries/mysterium-tequilapi/dto/connection-status-enum'
import type { Size } from './window'
import type { MysterionConfig } from './mysterionConfig'
import Window from './window'
import Terms from './terms'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'
import TequilapiProposalFetcher from './data-fetchers/tequilapi-proposal-fetcher'
import CountryList from './data-fetchers/country-list'
import type { BugReporter } from './bug-reporting/interface'
import { UserSettingsStore } from './user-settings/user-settings-store'
import Notification from './notification'
import type { MessageBus } from './communication/message-bus'
import IdentityDTO from '../libraries/mysterium-tequilapi/dto/identity'
import type { CurrentIdentityChangeDTO } from './communication/dto'
import type { EnvironmentCollector } from './bug-reporting/environment/environment-collector'
import {BugReporterMetrics, METRICS, TAGS} from '../app/bug-reporting/bug-reporter-metrics'
import LogCache from './logging/log-cache'
import SyncCallbacksInitializer from './sync-callbacks-initializer'
import SyncReceiverMainCommunication from './communication/sync/sync-main-communication'
import { SyncIpcReceiver } from './communication/sync/sync-ipc'
import type { StringLogger } from './logging/string-logger'
import logger from './logger'
import MainIpc from './communication/ipc/main-ipc'
import IpcMessageBus from './communication/ipc-message-bus'

type MysterionParams = {
  browserWindowFactory: () => BrowserWindow,
  windowFactory: () => Window,
  config: MysterionConfig,
  terms: Terms,
  installer: Installer,
  monitoring: ProcessMonitoring,
  process: Process,
  proposalFetcher: TequilapiProposalFetcher,
  countryList: CountryList,
  bugReporter: BugReporter,
  environmentCollector: EnvironmentCollector,
  bugReporterMetrics: BugReporterMetrics,
  logger: StringLogger,
  frontendLogCache: LogCache,
  mysteriumProcessLogCache: LogCache,
  userSettingsStore: UserSettingsStore,
  disconnectNotification: Notification
}

const LOG_PREFIX = '[Mysterion] '
const MYSTERIUM_CLIENT_STARTUP_THRESHOLD = 10000

class Mysterion {
  // TODO: mark these as private
  browserWindowFactory: () => BrowserWindow
  windowFactory: Function
  config: MysterionConfig
  terms: Terms
  installer: Installer
  monitoring: ProcessMonitoring
  process: Process
  proposalFetcher: TequilapiProposalFetcher
  countryList: CountryList
  bugReporter: BugReporter
  environmentCollector: EnvironmentCollector
  bugReporterMetrics: BugReporterMetrics
  logger: StringLogger
  frontendLogCache: LogCache
  mysteriumProcessLogCache: LogCache
  userSettingsStore: UserSettingsStore
  disconnectNotification: Notification

  window: Window
  messageBus: MessageBus
  communication: MainMessageBusCommunication

  constructor (params: MysterionParams) {
    this.browserWindowFactory = params.browserWindowFactory
    this.windowFactory = params.windowFactory
    this.config = params.config
    this.terms = params.terms
    this.installer = params.installer
    this.monitoring = params.monitoring
    this.process = params.process
    this.proposalFetcher = params.proposalFetcher
    this.countryList = params.countryList
    this.bugReporter = params.bugReporter
    this.environmentCollector = params.environmentCollector
    this.bugReporterMetrics = params.bugReporterMetrics
    this.logger = params.logger
    this.frontendLogCache = params.frontendLogCache
    this.mysteriumProcessLogCache = params.mysteriumProcessLogCache
    this.userSettingsStore = params.userSettingsStore
    this.disconnectNotification = params.disconnectNotification
  }

  run () {
    this._makeSureOnlySingleInstanceIsRunning()

    logger.setLogger(this.logger)
    this.bugReporterMetrics.set(TAGS.SESSION_ID, generateSessionId())
    this._initializeSyncCallbacks()
    this.logUnhandledRejections()

    // fired when app has been launched
    app.on('ready', async () => {
      try {
        logInfo('Application launch')
        await this.bootstrap()
        this._buildTray()
      } catch (e) {
        logException('Application launch failed', e)
        this.bugReporter.captureErrorException(e)
      }
    })
    // fired when all windows are closed
    app.on('window-all-closed', () => this.onWindowsClosed())
    // fired just before quitting, this should quit
    app.on('will-quit', () => this.onWillQuit())
    // fired when app activated
    app.on('activate', () => {
      try {
        logInfo('Application activation')
        if (!this.window.exists()) {
          this.bootstrap()
          return
        }
        this.window.show()
      } catch (e) {
        logException('Application activation failed', e)
        this.bugReporter.captureErrorException(e)
      }
    })
    app.on('before-quit', () => {
      this.window.willQuitApp = true
    })
  }

  _initializeSyncCallbacks () {
    const receiver = new SyncIpcReceiver()
    const communication = new SyncReceiverMainCommunication(receiver)
    const initializer = new SyncCallbacksInitializer(communication, this.environmentCollector, this.frontendLogCache)
    initializer.initialize()
  }

  logUnhandledRejections () {
    process.on('unhandledRejection', error => {
      logException('Received unhandled rejection:', error)
    })
  }

  async bootstrap () {
    const showTerms = !this._areTermsAccepted()
    const browserWindow = this._createBrowserWindow()
    const windowSize = this._getWindowSize(showTerms)
    this.window = this._createWindow(windowSize)

    const send = this._getSendFunction(browserWindow)
    const ipc = new MainIpc(send, this.bugReporter.captureErrorException)
    this.messageBus = new IpcMessageBus(ipc)
    this.communication = new MainMessageBusCommunication(this.messageBus)
    this.communication.onCurrentIdentityChange((identityChange: CurrentIdentityChangeDTO) => {
      const identity = new IdentityDTO({id: identityChange.id})
      this.bugReporter.setUser(identity)
    })
    this.bugReporterMetrics.startSyncing(this.communication)
    this.bugReporterMetrics.setWithCurrentDateTime(METRICS.START_TIME)

    await this._onRendererLoaded()

    if (showTerms) {
      const accepted = await this._acceptTermsOrQuit()
      if (!accepted) {
        return
      }
      this.window.resize(this._getWindowSize(false))
    }

    await this._ensureDaemonInstallation()
    this._startProcess()
    this._startProcessMonitoring()
    this._onProcessReady(() => {
      logInfo(`Notify that 'mysterium_client' process is ready`)
      this.communication.sendMysteriumClientIsReady()
    })

    this._subscribeProposals()

    syncFavorites(this.userSettingsStore, this.communication)
    syncShowDisconnectNotifications(this.userSettingsStore, this.communication)
    showNotificationOnDisconnect(this.userSettingsStore, this.communication, this.disconnectNotification)
    await this._loadUserSettings()
    this.disconnectNotification.onReconnect(this.communication.sendReconnectRequest.bind(this.communication))
  }

  _getWindowSize (showTerms: boolean) {
    if (showTerms) {
      return this.config.windows.terms
    } else {
      return this.config.windows.app
    }
  }

  _areTermsAccepted (): boolean {
    logInfo('Checking terms cache')
    try {
      this.terms.load()
      return this.terms.isAccepted()
    } catch (e) {
      this.bugReporter.captureErrorException(e)
      return false
    }
  }

  _getSendFunction (browserWindow: BrowserWindow) {
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

  _createWindow (size: Size) {
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
    if (await this.installer.needsInstallation()) {
      logInfo("Installing 'mysterium_client' process")
      try {
        await this.installer.install()
      } catch (e) {
        let messageForUser = translations.processInstallationError
        if (e.message === SUDO_PROMT_PERMISSION_DENIED) {
          messageForUser = translations.processInstallationPermissionsError
        }
        this.communication.sendRendererShowErrorMessage(messageForUser)
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

  _makeSureOnlySingleInstanceIsRunning () {
    // this hook is fired when someone tries to launch another instance of the app
    const secondInstanceIsRunning = app.makeSingleInstance(() => {
      // display the existing instance's app window
      if (this.window.exists()) {
        this.window.show()
      }
    })

    // quit all new app instances
    if (secondInstanceIsRunning) {
      app.quit()
    }
  }

  onWindowsClosed () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  async onWillQuit () {
    this.monitoring.stop()
    // TODO: fix - proposalFetcher can still be undefined at this point
    try {
      await this.proposalFetcher.stop()
    } catch (e) {
      logException('Failed to stop proposal fetcher', e)
      this.bugReporter.captureErrorException(e)
    }

    try {
      await this.process.stop()
    } catch (e) {
      logException("Failed to stop 'mysterium_client' process", e)
      this.bugReporter.captureErrorException(e)
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
      const errorObj = (error: Object)
      errorObj.original = e
      throw error
    }
    return true
  }

  _startProcess () {
    const cacheLogs = (level, data) => {
      this.mysteriumProcessLogCache.pushToLevel(level, data)
    }

    logInfo("Starting 'mysterium_client' process")
    this.process.start()
      .then(() => { logInfo('mysterium_client start successful') })
      .catch((e) => { logException('mysterium_client start failed', e) })

    try {
      this.process.setupLogging()
      this.process.onLog(processLogLevels.INFO, (data) => cacheLogs(processLogLevels.INFO, data))
      this.process.onLog(processLogLevels.ERROR, (data) => cacheLogs(processLogLevels.ERROR, data))
    } catch (e) {
      logException('Failing to process logs. ', e)
      this.bugReporter.captureErrorException(e)
    }
  }

  _startProcessMonitoring () {
    this.monitoring.onStatusUp(() => {
      logInfo("'mysterium_client' is up")
      this.communication.sendMysteriumClientUp()
      this.bugReporterMetrics.set(METRICS.CLIENT_RUNNING, true)
    })
    this.monitoring.onStatusDown(() => {
      logInfo("'mysterium_client' is down")
      this.communication.sendMysteriumClientDown()
      this.bugReporterMetrics.set(METRICS.CLIENT_RUNNING, false)
    })
    this.monitoring.onStatus((status) => {
      if (status === false) {
        logInfo("Starting 'mysterium_client' process, because it's currently down")
        this.process.start()
      }
    })

    logInfo("Starting 'mysterium_client' monitoring")
    this.monitoring.start()
  }

  _onProcessReady (callback: () => void) {
    onFirstEventOrTimeout(this.monitoring.onStatusUp.bind(this.monitoring), MYSTERIUM_CLIENT_STARTUP_THRESHOLD)
      .then(callback)
      .catch(err => {
        this.communication.sendRendererShowErrorMessage(translations.processStartError)
        logException("Failed to start 'mysterium_client' process", err)
      })
  }

  _subscribeProposals () {
    this.countryList.onUpdate((countries) => this.communication.sendCountries(countries))
    this.communication.onProposalUpdateRequest(() => {
      this.proposalFetcher.fetch()
    })
    this.proposalFetcher.onFetchingError((error: Error) => {
      logException('Proposal fetching failed', error)
      this.bugReporter.captureErrorException(error)
    })

    this.monitoring.onStatusUp(() => {
      logInfo('Starting proposal fetcher')
      this.proposalFetcher.start()
    })
    this.monitoring.onStatusDown(() => {
      this.proposalFetcher.stop()
    })
  }

  _buildTray () {
    logInfo('Building tray')
    trayFactory(
      this.communication,
      this.countryList,
      this.window,
      path.join(this.config.staticDirectory, 'icons')
    )
  }
}

function showNotificationOnDisconnect (userSettingsStore, communication, disconnectNotification) {
  communication.onConnectionStatusChange((status) => {
    const shouldShowNotification =
      userSettingsStore.getAll().showDisconnectNotifications &&
      (status.newStatus === ConnectionStatusEnum.NOT_CONNECTED &&
        status.oldStatus === ConnectionStatusEnum.CONNECTED)

    if (shouldShowNotification) {
      disconnectNotification.show()
    }
  })
}

function syncFavorites (userSettingsStore, communication) {
  communication.onToggleFavoriteProvider((fav) => {
    userSettingsStore.setFavorite(fav.id, fav.isFavorite)
    userSettingsStore.save()
  })
}

function syncShowDisconnectNotifications (userSettingsStore, communication) {
  communication.onUserSettingsRequest(() => {
    communication.sendUserSettings(userSettingsStore.getAll())
  })

  communication.onUserSettingsShowDisconnectNotifications((show) => {
    userSettingsStore.setShowDisconnectNotifications(show)
    userSettingsStore.save()
  })
}

function logInfo (message: string) {
  logger.info(LOG_PREFIX + message)
}

function logException (message: string, err: Error) {
  logger.error(LOG_PREFIX + message, err)
}

function generateSessionId () {
  return Math.floor(Math.random() * 10 ** 9).toString()
}

export default Mysterion
