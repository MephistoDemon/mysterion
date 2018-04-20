// @flow

class ProposalDto {
  id: number
  providerId: string
  serviceType: string
  serviceDefinition: {
    locationOriginate: {
      country: string
    }
  }

  constructor (data: Object) {
    Object.assign(this, {
      id: data.id,
      providerId: data.providerId,
      serviceType: data.serviceType,
      serviceDefinition: {
        locationOriginate: {
          country: data.serviceDefinition.locationOriginate.country
        }
      }
    })
  }
}

export default ProposalDto
