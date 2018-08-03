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
import type { FavoriteProviders } from '../user-settings/user-settings'

const COUNTRY_NAME_UNRESOLVED = 'N/A'
const COUNTRY_CODE_LENGTH = 2

type Country = {
  id: string,
  code: ?string,
  name: string,
  isFavorite: boolean
}

function getCountryLabel (country: Country, maxNameLength: ?number = null, maxIdentityLength: ?number = 9) {
  const identity = limitedLengthString(country.id, maxIdentityLength)
  let title = limitedLengthString(country.name, maxNameLength)
  if (title === COUNTRY_NAME_UNRESOLVED && country.code) {
    title += ` ${limitedLengthString(country.code, COUNTRY_CODE_LENGTH)}`
  }

  return `${title} (${identity})`
}

function getSortedCountryListFromProposals (proposals: Array<ProposalDTO>, favorites: FavoriteProviders): Array<Country> {
  const countries = proposals.map(getCountryFromProposal).map(countryFavoriteMapper(favorites))
  return countries.sort(compareCountries)
}

function limitedLengthString (value: string, maxLength: ?number = null): string {
  if (maxLength && value.length > maxLength) {
    return value.substring(0, maxLength) + '..'
  }
  return value
}

function countryFavoriteMapper (favorites: FavoriteProviders): (Country) => Country {
  return (country: Country) => {
    return { ...country, isFavorite: favorites.has(country.id) }
  }
}

function getCountryFromProposal (proposal: ProposalDTO): Country {
  return {
    id: proposal.providerId,
    code: getCountryCodeFromProposal(proposal),
    name: getCountryNameFromProposal(proposal),
    isFavorite: false
  }
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

function isCountryUnresolved (countryCode: string): boolean {
  return countryCode != null &&
    typeof countries[countryCode.toLocaleLowerCase()] !== 'undefined'
}

function getCountryName (countryCode: string): string {
  countryCode = countryCode.toLowerCase()
  if (!isCountryUnresolved(countryCode)) {
    return COUNTRY_NAME_UNRESOLVED
  }

  return countries[countryCode]
}

function getCountryNameFromProposal (proposal: ProposalDTO): string {
  const countryCode = getCountryCodeFromProposal(proposal)
  if (!countryCode) {
    return COUNTRY_NAME_UNRESOLVED
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

export type { Country }
export {
  getCountryLabel,
  getSortedCountryListFromProposals,
  isCountryUnresolved
}
