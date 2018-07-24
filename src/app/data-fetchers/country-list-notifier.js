/*
 * Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
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
import ProposalFetcher from './proposal-fetcher'
import type { Country } from '../countries'
import Subscriber from '../../libraries/subscriber'
import { getSortedCountryListFromProposals } from '../countries'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'
import type { Callback } from '../../libraries/subscriber'
import { UserSettingsStore } from '../user-settings/user-settings-store'
import type { FavoriteProviders } from '../user-settings/user-settings'

class CountryListNotifier {
  _proposalFetcher: ProposalFetcher
  _userSettingsStore: UserSettingsStore
  _listeners: Subscriber<Array<Country>> = new Subscriber()

  _proposals: ProposalDTO[] = []
  _favorites: FavoriteProviders = new Set()

  constructor (proposalFetcher: ProposalFetcher, store: UserSettingsStore) {
    this._proposalFetcher = proposalFetcher
    this._userSettingsStore = store
    this._subscribeToProposalFetches()
    this._subscribeToFavoriteChanges()
  }

  onUpdate (listener: Callback<Array<Country>>) {
    this._listeners.subscribe(listener)
  }

  _subscribeToFavoriteChanges () {
    this._userSettingsStore.onChange('favoriteProviders', (favorites) => {
      this._favorites = favorites
      this._notify()
    })
  }

  _notify () {
    this._listeners.notify(getSortedCountryListFromProposals(this._proposals, this._favorites))
  }

  _subscribeToProposalFetches () {
    this._proposalFetcher.onFetchedProposals((proposals: ProposalDTO[]) => {
      this._proposals = proposals
      this._notify()
    })
  }
}

export default CountryListNotifier
