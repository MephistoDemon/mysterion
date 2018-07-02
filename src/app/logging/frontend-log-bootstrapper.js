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

// @flow

import winston from 'winston'
import type { SyncRendererCommunication } from '../communication/sync/sync-communication'
import SyncCommunicationTransport from './frontend-log-transport'
import logger from '../logger'
import { winstonFormat } from './log-boostrapping'

class FrontendLogBootstrapper {
  _communication: SyncRendererCommunication

  constructor (communication: SyncRendererCommunication) {
    this._communication = communication
  }

  init () {
    const winstonLogger = winston.createLogger({
      format: winstonFormat,
      transports: [
        new winston.transports.Console(),
        new SyncCommunicationTransport(this._communication)
      ]
    })
    logger.setFrontendLogger(winstonLogger)
  }
}

export default FrontendLogBootstrapper
