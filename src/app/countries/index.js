// @flow
import countries from './list'
import ProposalDto from '../../libraries/api/client/dto/proposal'

const COUNTRY_NAME_UNKNOWN = 'N/A'

function getCountryName (countryCode: string): string {
  countryCode = countryCode.toLowerCase()
  if (typeof countries[countryCode] === 'undefined') {
    return COUNTRY_NAME_UNKNOWN
  }

  return countries[countryCode]
}

function getCountryNameFromProposal (proposal: ProposalDto): string {
  const countryCode = getCountryCodeFromProposal(proposal)
  if (!countryCode) {
    return COUNTRY_NAME_UNKNOWN
  }

  return getCountryName(countryCode)
}

function getCountryCodeFromProposal (proposal: ProposalDto): ?string {
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

export {getCountryName, getCountryNameFromProposal, getCountryCodeFromProposal}
