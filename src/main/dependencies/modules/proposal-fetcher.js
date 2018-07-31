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

import TequilapiProposalFetcher from '../../../app/data-fetchers/tequilapi-proposal-fetcher'
import type {Container} from '../../../app/di'
import { UserSettingsStore } from '../../../app/user-settings/user-settings-store'
import CountryList from '../../../app/data-fetchers/country-list'

function bootstrap (container: Container) {
  container.constant(
    'proposalFetcher.config',
    {
      'interval': 5000
    }
  )
  container.service(
    'proposalFetcher',
    ['tequilapiClient', 'proposalFetcher.config'],
    (tequilapiClient, config: any) => {
      return new TequilapiProposalFetcher(tequilapiClient, config.interval)
    }
  )

  container.factory(
    'countryList',
    ['proposalFetcher', 'userSettingsStore'],
    (proposalFetcher: TequilapiProposalFetcher, userSettingsStore: UserSettingsStore) => {
      return new CountryList(proposalFetcher, userSettingsStore)
    }
  )
}

export default bootstrap
