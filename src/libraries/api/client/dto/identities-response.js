// @flow
import IdentityDTO from './identity'

type ResponseMap = Array<Object>

class IdentitiesResponseDTO {
  identities: Array<IdentityDTO>

  constructor (responseData: ResponseMap) {
    if (typeof responseData !== 'undefined' && Array.isArray(responseData)) {
      this.identities = responseData.map((identity) => new IdentityDTO(identity))
    }
  }
}

export default IdentitiesResponseDTO
