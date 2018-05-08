// @flow
import type {ConnectionStatus} from '../../libraries/api/client/dto/connection-status-enum'
import ProposalDTO from '../../libraries/api/client/dto/proposal'

export type ConnectionStatusChangeDTO = {
  oldStatus: ConnectionStatus,
  newStatus: ConnectionStatus
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
