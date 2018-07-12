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
import countries from './list'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'
import container from '../../main/dependencies'
import type { FavoriteProviders, UserSettings } from '../user-settings/user-settings'

const COUNTRY_NAME_UNKNOWN = 'N/A'
let userSettings: UserSettings

type Country = {
  id: string,
  code: ?string,
  name: string,
  isFavorite: boolean
}

function getCountryLabel (country: Country, maxNameLength: ?number = null, maxIdentityLength: ?number = 9) {
  const identity = limitedLengthString(country.id, maxIdentityLength)
  const name = limitedLengthString(country.name, maxNameLength)

  return `${name} (${identity})`
}

function getSortedCountryListFromProposals (proposals: Array<ProposalDTO>): Array<Country> {
  const countries = proposals.map(getCountryFromProposal)

  return countries.sort(compareCountries)
}

function limitedLengthString (value: string, maxLength: ?number = null): string {
  if (maxLength && value.length > maxLength) {
    return value.substring(0, maxLength) + '..'
  }
  return value
}

function getFavorites (): FavoriteProviders {
  userSettings = userSettings || container.get('userSettingsStore').get()
  return userSettings.favoriteProviders || {}
}

async function setFavorites (favorites: FavoriteProviders): Promise<void> {
  const settingsStore = container.get('userSettingsStore')
  userSettings = userSettings || settingsStore.get()
  userSettings.favoriteProviders = favorites
  await settingsStore.save()
}

function getCountryFromProposal (proposal: ProposalDTO): Country {
  let favorites = getFavorites()
  return {
    id: proposal.providerId,
    code: getCountryCodeFromProposal(proposal),
    name: getCountryNameFromProposal(proposal),
    isFavorite: favorites[proposal.providerId]
  }
}

async function toggleFavorite ({id, isFavorite}: {id: string, isFavorite: boolean}): Promise<void> {
  const favorites = getFavorites()
  favorites[id] = isFavorite
  await setFavorites(favorites)
}

function compareCountries (a: Country, b: Country) {
  if (a.isFavorite && !b.isFavorite) {
    return -1
  } else if (!a.isFavorite && b.isFavorite) {
    return 1
  } else if (a.name > b.name) {
    return 1
  } else if (b.name > a.name) {
    return -1
  }

  return 0
}

function getCountryName (countryCode: string): string {
  countryCode = countryCode.toLowerCase()
  if (typeof countries[countryCode] === 'undefined') {
    return COUNTRY_NAME_UNKNOWN
  }

  return countries[countryCode]
}

function getCountryNameFromProposal (proposal: ProposalDTO): string {
  const countryCode = getCountryCodeFromProposal(proposal)
  if (!countryCode) {
    return COUNTRY_NAME_UNKNOWN
  }

  return getCountryName(countryCode)
}

function getCountryCodeFromProposal (proposal: ProposalDTO): ?string {
  if (proposal.serviceDefinition == null) {
    return null
  }
  if (proposal.serviceDefinition.locationOriginate == null) {
    return null
  }
  if (proposal.serviceDefinition.locationOriginate.country == null) {
    return null
  }

  return proposal.serviceDefinition.locationOriginate.country
}

export type {Country}
export {
  getCountryLabel,
  getSortedCountryListFromProposals,
  toggleFavorite
}
