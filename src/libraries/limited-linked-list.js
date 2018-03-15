import LinkedList from 'dbly-linked-list'

export default class LLLRotation {
  /**
   *
   * @param {number} limit - max size of list
   */
  constructor (limit) {
    this.limit = limit
    this.linkedList = new LinkedList()
  }

  /**
   * Appends item to the end of list.
   * If list size exceeds limit, the removes the oldest entry,
   * keeping the size in limits
   * @param {object|string|number} data
   */
  insert (data) {
    if (this.linkedList.getSize() >= this.limit) {
      this.linkedList.removeFirst()
    }
    this.linkedList.insert(data)
  }

  toArray () {
    return this.linkedList.toArray()
  }

  get length () {
    return this.linkedList.getSize()
  }
  get oldest () {
    return this.linkedList.getHeadNode().data
  }
  get newest () {
    return this.linkedList.getTailNode().data
  }
}
