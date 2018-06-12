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

import { beforeEach, describe, expect, it } from '../../helpers/dependencies'
import Subscriber from '../../../src/libraries/subscriber'

describe('Subscriber', () => {
  let subscriber: Subscriber<string>
  beforeEach(() => {
    subscriber = new Subscriber()
  })

  it('notifies each event', () => {
    const values: Array<string> = []
    subscriber.subscribe((value: string) => {
      values.push(value)
    })

    subscriber.notify('hello')
    subscriber.notify('world')

    expect(values).to.eql(['hello', 'world'])
  })

  it('notifies multiple subscribers', () => {
    let value1 = null
    let value2 = null
    subscriber.subscribe((value: string) => {
      value1 = value
    })
    subscriber.subscribe((value: string) => {
      value2 = value
    })

    subscriber.notify('hey')

    expect(value1).to.eql('hey')
    expect(value2).to.eql('hey')
  })

  it('notifies all subscribers when first is failing', () => {
    let value1 = null
    let value2 = null
    subscriber.subscribe((value: string) => {
      value1 = value
      throw new Error('mock error')
    })
    subscriber.subscribe((value: string) => {
      value2 = value
    })

    subscriber.notify('hey')

    expect(value1).to.eql('hey')
    expect(value2).to.eql('hey')
  })
})
