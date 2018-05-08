// @flow
import LocationDTO from './location'

class ServiceDefinitionDTO {
  locationOriginate: ?LocationDTO

  constructor (data: Object) {
    if (data.locationOriginate) {
      this.locationOriginate = new LocationDTO(data.locationOriginate)
    }
  }
}

export default ServiceDefinitionDTO
