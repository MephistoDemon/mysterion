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

import { beforeEach, describe, expect, it } from '../../../helpers/dependencies'
import ListenerKeeper from '../../../../src/app/communication/listener-keeper'
import { captureError } from '../../../helpers/utils'

describe('ListenerKeeper', () => {
  let keeper

  beforeEach(() => {
    keeper = new ListenerKeeper()
  })

  describe('.createListener', () => {
    it('throws error when subscribing same callback to the same channel twice', () => {
      const callback = () => {}
      const create = () => keeper.createListener('channel', callback)
      create()
      const err = captureError(create)
      expect(err).to.be.an('error')
    })

    it('subscribes same callback to different channels', () => {
      const callback = () => {}
      keeper.createListener('channel 1', callback)
      keeper.createListener('channel 2', callback)
    })
  })

  describe('.removeListener', () => {
    it('allows re-subscribing same callback again', () => {
      const callback = () => {}
      keeper.createListener('channel', callback)
      keeper.removeListener('channel', callback)

      keeper.createListener('channel', callback)
    })

    it('throws error when invoke twice for same callback', () => {
      const callback = () => {}
      keeper.createListener('channel', callback)
      const remove = () => keeper.removeListener('channel', callback)
      remove()
      const err = captureError(remove)
      expect(err).to.be.an('error')
    })
  })
})
