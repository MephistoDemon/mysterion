// @flow

export type ConnectionStatusChangeData = {
  oldStatus: string,
  newStatus: string
}

export type MysteriumClientLogData = {
  level: string,
  data: mixed
}

export type IdentitySetData = {
  id: string
}
