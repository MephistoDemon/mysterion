// TODO: rename to messages.js
export default {
  CONNECTION_STATUS_CHANGED: 'connection.status.changed',
  CONNECTION_REQUEST: 'connection.request',
  CONNECTION_CANCEL: 'connection.cancel',

  MYSTERIUM_CLIENT_LOG: 'mysterium.client.log',
  CURRENT_IDENTITY_CHANGED: 'current.identity.changed',
  RENDERER_LOADED: 'renderer.loaded',

  TERMS_REQUESTED: 'terms.requested',
  TERMS_ANSWERED: 'terms.answered',

  // TODO: refactor these message to be used in communication
  TERMS_ACCEPTED: 'terms.accepted',
  APP_START: 'app.start',
  APP_ERROR: 'app.error',
  HEALTHCHECK: 'healthcheck',
  PROPOSALS_UPDATE: 'proposals.update'
}
