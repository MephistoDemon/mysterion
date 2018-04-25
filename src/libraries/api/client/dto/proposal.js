// @flow
import ServiceDefinitionDto from './service-definition'

class ProposalDto {
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
      this.serviceDefinition = new ServiceDefinitionDto(data.serviceDefinition)
    }
  }
}

export default ProposalDto
