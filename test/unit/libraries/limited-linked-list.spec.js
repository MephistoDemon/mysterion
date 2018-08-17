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

import LimitedLinkedList from '../../../src/libraries/limited-linked-list'

describe('LimitedLinkedList', () => {
  let limitedLinkedList
  let err
  beforeEach(() => {
    limitedLinkedList = new LimitedLinkedList(5)
    limitedLinkedList.insert('some string')
    limitedLinkedList.insert(['some', 'array'])
    limitedLinkedList.insert({ some: 'object' })
    limitedLinkedList.insert(2)
    err = new Error('err')
    limitedLinkedList.insert(err)
  })

  it('can do arrays', () => {
    expect(limitedLinkedList.toArray()).to.be.eql(
      [
        'some string',
        ['some', 'array'],
        { some: 'object' },
        2,
        err
      ])
  })

  it('doesn\'t exceed limits', () => {
    limitedLinkedList.insert('more content')
    const arrayRepresentation = limitedLinkedList.toArray()
    expect(arrayRepresentation.length).to.be.eql(5)
    expect(arrayRepresentation.pop()).to.be.eql('more content')
  })
})
