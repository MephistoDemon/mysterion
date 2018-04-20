// @flow

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
