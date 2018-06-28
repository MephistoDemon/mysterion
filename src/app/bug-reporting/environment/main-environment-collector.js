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
import type { SerializedLogCaches } from '../../logging/log-cache-bundle'
import LogCacheBundle from '../../logging/log-cache-bundle'
import type { RavenData } from '../bug-reporter-metrics'
import { BugReporterMetrics } from '../bug-reporter-metrics'

class MainEnvironmentCollector implements EnvironmentCollector {
  _logCacheBundle: LogCacheBundle
  _mysterionReleaseId: string
  _bugReporterMetrics: BugReporterMetrics
  _sessionId: string

  constructor (logCacheBundle: LogCacheBundle, mysterionReleaseId: string, bugReporterMetrics: BugReporterMetrics) {
    this._logCacheBundle = logCacheBundle
    this._mysterionReleaseId = mysterionReleaseId
    this._bugReporterMetrics = bugReporterMetrics
    this._sessionId = generateSessionId()
  }

  getMysterionReleaseId (): string {
    return this._mysterionReleaseId
  }

  getSessionId (): string {
    return this._sessionId
  }

  getSerializedCaches (): SerializedLogCaches {
    return this._logCacheBundle.getSerialized()
  }

  getMetrics (): RavenData {
    return this._bugReporterMetrics.getMetrics()
  }
}

function generateSessionId () {
  return Math.floor(Math.random() * 10 ** 9).toString()
}

export default MainEnvironmentCollector
