// @flow
import ServiceDefinitionDTO from './service-definition'

class ProposalDTO {
  id: number
  providerId: string
  serviceType: string
  serviceDefinition: {
    locationOriginate: {
      country: ?string
    }
  }

  constructor (data: Object) {
    this.id = data.id
    this.providerId = data.providerId
    this.serviceType = data.serviceType
    if (data.serviceDefinition) {
      this.serviceDefinition = new ServiceDefinitionDTO(data.serviceDefinition)
    }
  }
}

export default ProposalDTO
