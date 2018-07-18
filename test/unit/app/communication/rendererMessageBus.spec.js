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

import { describe, expect, it } from '../../../helpers/dependencies'
import RendererMessageBus from '../../../../src/app/communication/renderer-message-bus'
import messages from '../../../../src/app/communication/messages'
import { captureError } from '../../../helpers/utils'

describe('RendererMessageBus', () => {
  describe('.removeCallback', () => {
    it('returns error for unknown callbacks', () => {
      const messageBus = new RendererMessageBus()
      const f = () => messageBus.removeCallback(messages.CONNECTION_REQUEST, () => {})
      const error = captureError(f)
      expect(error).to.be.an('error')
    })
  })
})
