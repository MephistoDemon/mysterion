/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// TODO: rename to messages.js
export default {
  // async messages
  CONNECTION_STATUS_CHANGED: 'connection.status.changed',
  CONNECTION_REQUEST: 'connection.request',
  CONNECTION_CANCEL: 'connection.cancel',

  MYSTERIUM_CLIENT_READY: 'mysterium-client.ready',
  MYSTERIUM_CLIENT_LOG: 'mysterium-client.log',
  CURRENT_IDENTITY_CHANGED: 'current.identity.changed',

  MYSTERION_BACKEND_LOG: 'MYSTERION_BACKEND_LOG',

  TERMS_REQUESTED: 'terms.requested',
  TERMS_ANSWERED: 'terms.answered',
  TERMS_ACCEPTED: 'terms.accepted',

  RENDERER_BOOTED: 'renderer.booted',
  RENDERER_SHOW_ERROR: 'renderer.show-error',

  HEALTHCHECK_UP: 'healthcheck.up',
  HEALTHCHECK_DOWN: 'healthcheck.down',

  PROPOSALS_UPDATE: 'proposals.update',

  TOGGLE_FAVORITE_PROVIDER: 'toggle.favorite.provider',

  USER_SETTINGS: 'user.settings',
  USER_SETTINGS_REQUEST: 'user.settings.request',
  USER_SETTINGS_UPDATE: 'user.settings.update',

  METRIC_SYNC: 'metric.sync',

  // sync messages
  GET_SESSION_ID: 'GET_SESSION_ID',
  GET_SERIALIZED_CACHES: 'GET_SERIALIZED_CACHES',
  GET_METRICS: 'GET_METRICS',
  LOG: 'LOG'
}
