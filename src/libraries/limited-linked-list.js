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

import LinkedList from 'dbly-linked-list'

export default class LimitedLinkedList {
  /**
   * Uses Doubly Linked List to store limited list of data.
   * when limit is reached and new element is inserted, the oldest one is removed
   * @param {number} limit - max size of list
   */
  constructor (limit) {
    this._limit = limit
    this._linkedList = new LinkedList(limit)
  }

  /**
   * Appends item to the end of list.
   * If list size exceeds limit, the removes the oldest entry,
   * keeping the size in limits
   * @param {*} data
   */
  insert (data) {
    if (this._linkedList.getSize() >= this._limit) {
      this._linkedList.removeFirst()
    }
    this._linkedList.insert(data)
  }

  /**
   * returns array representation on the list
   * @returns {*|T[]}
   */
  toArray () {
    return this._linkedList.toArray()
  }
}
