/* eslint-disable no-unused-expressions */
import LimitedLinkedList from '../../../../src/libraries/limited-linked-list'

describe('LimitedLinkedList', () => {
  let limitedLinkedList
  let err
  beforeEach(() => {
    limitedLinkedList = new LimitedLinkedList(5)
    limitedLinkedList.insert('some string')
    limitedLinkedList.insert(['some', 'array'])
    limitedLinkedList.insert({some: 'object'})
    limitedLinkedList.insert(2)
    err = new Error('err')
    limitedLinkedList.insert(err)
  })

  it('can do arrays', () => {
    expect(limitedLinkedList.toArray()).to.be.eql(
      [
        'some string',
        ['some', 'array'],
        {some: 'object'},
        2,
        err
      ])
  })

  it('doesn\'t exceed limits', () => {
    limitedLinkedList.insert('more content')
    expect(limitedLinkedList.getOldest()).to.be.eql(['some', 'array'])
    expect(limitedLinkedList.getNewest()).to.be.eql('more content')
    expect(limitedLinkedList.getLength()).to.be.eql(5)
  })
})
