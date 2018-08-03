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

import { onFirstEvent } from '../../../../src/app/communication/utils'

const subscription = (onResolve) => onResolve('resolution of instant data')
const subscriptionAsync = async (onResolve) => {
  const data = await new Promise((resolve) => {
    resolve('resolution of async data')
  })
  onResolve(data)
}

describe('onFirstEvent', () => {
  it('resolves once serial data is passed to callback', async () => {
    const resolvedData = await onFirstEvent(subscription)
    expect(resolvedData).to.eql('resolution of instant data')
  })

  it('resolves once promise is resolved', async () => {
    const resolvedData = await onFirstEvent(subscriptionAsync)
    expect(resolvedData).to.eql('resolution of async data')
  })
})
