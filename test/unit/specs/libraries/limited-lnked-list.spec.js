/* eslint-disable no-unused-expressions */
import LimitedList from '../../../../src/libraries/limited-linked-list'

describe('Limited Linked List', () => {
  let lll
  let err
  before(() => {
    lll = new LimitedList(5)
    lll.insert('some string')
    lll.insert(['some', 'array'])
    lll.insert({some: 'object'})
    lll.insert(2)
    err = new Error('err')
    lll.insert(err)
  })

  it('can do arrays', () => {
    expect(lll.toArray()).to.be.eql(
      [
        'some string',
        ['some', 'array'],
        {some: 'object'},
        2,
        err
      ])
  })

  it('doesn\'t exceed limits', () => {
    lll.insert('more content')
    expect(lll.getOldest()).to.be.eql(['some', 'array'])
    expect(lll.getNewest()).to.be.eql('more content')
    expect(lll.getLength()).to.be.eql(5)
  })
})
