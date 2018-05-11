// @flow
import countries from './list'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'

const COUNTRY_NAME_UNKNOWN = 'N/A'

function _getCountryName (countryCode: string): string {
  countryCode = countryCode.toLowerCase()
  if (typeof countries[countryCode] === 'undefined') {
    return COUNTRY_NAME_UNKNOWN
  }

  return countries[countryCode]
}

function _getCountryNameFromProposal (proposal: ProposalDTO): string {
  const countryCode = _getCountryCodeFromProposal(proposal)
  if (!countryCode) {
    return COUNTRY_NAME_UNKNOWN
  }

  return _getCountryName(countryCode)
}

function _getCountryCodeFromProposal (proposal: ProposalDTO): ?string {
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

type Country = {
  id: string,
  code: string,
  name: string
}

function getCountryLabel (country: Country, maxIdentityLength: ?number = 9, maxNameLength: ?number = null) {
  let identity = country.id
  if (maxIdentityLength && identity.length > maxIdentityLength) {
    identity = identity.substring(0, maxIdentityLength) + '..'
  }

  let name = country.name
  if (maxNameLength && name.length > maxNameLength) {
    name = name.substring(0, maxNameLength) + '..'
  }

  return `${name} (${identity})`
}

function getSortedCountryListFromProposals (proposals: Array<ProposalDTO>): Array<Country> {
  const countries = proposals.map(_getCountryFromProposal)

  return countries.sort(_compareCountries)
}

function _getCountryFromProposal (proposal: ProposalDTO): Country {
  return {
    id: proposal.providerId,
    code: _getCountryCodeFromProposal(proposal),
    name: _getCountryNameFromProposal(proposal)
  }
}

function _compareCountries (a: Country, b: Country) {
  if (a.name > b.name) {
    return 1
  } else if (b.name > a.name) {
    return -1
  }

  return 0
}

export type {Country}
export {
  getCountryLabel,
  getSortedCountryListFromProposals
}
