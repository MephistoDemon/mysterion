// @flow

import ProposalDTO from '../../libraries/api/client/dto/proposal'

export type ConnectionStatusChangeDTO = {
  oldStatus: string,
  newStatus: string
}

export type MysteriumClientLogDTO = {
  level: string,
  data: mixed
}

export type CurrentIdentityChangeDTO = {
  id: string
}

export type ProposalUpdateDto = Array<ProposalDTO>

export type RequestConnectionDto = {
  providerId: string
}
