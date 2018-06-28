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

import type { EnvironmentCollector } from './environment-collector'
import type { SyncRendererCommunication } from '../../communication/sync/sync-communication'
import type { SerializedLogCaches } from '../../logging/log-cache-bundle'
import { BugReporterMetrics } from '../bug-reporter-metrics'

class RendererEnvironmentCollector implements EnvironmentCollector {
  _mysterionReleaseId: string
  _syncRendererCommunication: SyncRendererCommunication
  _bugReporterMetrics: BugReporterMetrics

  // TODO: use communication for fetching metrics
  constructor (mysterionReleaseId: string, syncRendererCommunication: SyncRendererCommunication, bugReporterMetrics: BugReporterMetrics) {
    this._mysterionReleaseId = mysterionReleaseId
    this._syncRendererCommunication = syncRendererCommunication
    this._bugReporterMetrics = bugReporterMetrics
  }

  getMysterionReleaseId (): string {
    return this._mysterionReleaseId
  }

  getSessionId (): string {
    return this._syncRendererCommunication.getSessionId() || ''
  }

  getSerializedCaches (): SerializedLogCaches {
    const defaultCache = { info: '', error: '' }
    const defaultCaches = { backend: defaultCache, mysterium_process: defaultCache, frontend: defaultCache }
    return this._syncRendererCommunication.getSerializedCaches() || defaultCaches
  }

  getMetrics () {
    return this._bugReporterMetrics.getMetrics()
  }
}

export default RendererEnvironmentCollector
