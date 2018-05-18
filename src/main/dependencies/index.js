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
import DIContainer from '../../app/di/jpex-container'
import mysterionBootstrap from './modules/application'
import bugReportingConfigBootstrap from '../../dependencies/bug-reporting'
import bugReportingBootstrap from './modules/bug-reporting'
import mysteriumClientBootstrap from './modules/mysterium-client'
import mysteriumTequilapiBootstrap from '../../dependencies/mysterium-tequilapi'
import proposalFetcherBootstrap from './modules/proposal-fetcher'
import userSettingsBootstrap from './modules/user-settings'
import disconnectNotificationsBootstrap from './modules/disconnect-notification'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  mysterionBootstrap(container)
  bugReportingConfigBootstrap(container)
  bugReportingBootstrap(container)
  mysteriumClientBootstrap(container)
  mysteriumTequilapiBootstrap(container)
  proposalFetcherBootstrap(container)
  userSettingsBootstrap(container)
  disconnectNotificationsBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
