import LinkedList from 'dbly-linked-list'

/**
 * @class
 * Uses Doubly Linked List to store limited list of data.
 * when limit is reached and new element is inserted, the oldest one is removed
 * @param {number} limit - max size of list
 */
export default function LimitedLinkedList (limit) {
  // limit and linkedList are private members
  let linkedList = new LinkedList(limit)

  /**
   * Appends item to the end of list.
   * If list size exceeds limit, the removes the oldest entry,
   * keeping the size in limits
   * @param {*} data
   */
  this.insert = (data) => {
    if (linkedList.getSize() >= limit) {
      linkedList.removeFirst()
    }
    linkedList.insert(data)
  }

  this.toArray = () => {
    return linkedList.toArray()
  }

  this.getLength = () => {
    return linkedList.getSize()
  }

  this.getOldest = () => {
    return linkedList.getHeadNode().data
  }

  this.getNewest = () => {
    return linkedList.getTailNode().data
  }
}
