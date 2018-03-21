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
