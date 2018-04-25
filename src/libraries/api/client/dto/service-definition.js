// @flow
import LocationDto from './location'

class ServiceDefinitionDto {
  locationOriginate: LocationDto

  constructor (data: Object) {
    if (data.locationOriginate) {
      this.locationOriginate = new LocationDto(data.locationOriginate)
    }
  }
}

export default ServiceDefinitionDto
