// @flow
import countries from './list'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'

const COUNTRY_NAME_UNKNOWN = 'N/A'

type Country = {
  id: string,
  code: string,
  name: string
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

function getCountryFromProposal (proposal: ProposalDTO): Country {
  return {
    id: proposal.providerId,
    code: getCountryCodeFromProposal(proposal),
    name: getCountryNameFromProposal(proposal)
  }
}

function compareCountries (a: Country, b: Country) {
  if (a.name > b.name) {
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
  if (typeof proposal.serviceDefinition === 'undefined') {
    return null
  }
  if (typeof proposal.serviceDefinition.locationOriginate === 'undefined') {
    return null
  }
  if (typeof proposal.serviceDefinition.locationOriginate.country === 'undefined') {
    return null
  }

  return proposal.serviceDefinition.locationOriginate.country
}

export type {Country}
export {
  getCountryLabel,
  getSortedCountryListFromProposals
}
