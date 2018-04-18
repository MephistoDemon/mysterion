// @flow

import GetCountryName from '@/plugins/countries'

class ProposalDto {
  id: number
  providerId: string
  serviceType: string
  serviceDefinition: {
    locationOriginate: {
      country: string
    }
  }

  constructor (data: mixed) {
    Object.assign(this, data)
  }

  getCountryName () {
    if (typeof this.serviceDefinition !== 'undefined') {
      if (typeof this.serviceDefinition.locationOriginate !== 'undefined') {
        if (typeof this.serviceDefinition.locationOriginate.country !== 'undefined') {
          return GetCountryName(this.serviceDefinition.locationOriginate.country)
        }
      }
    }

    return 'N\\A'
  }
}

export default ProposalDto
