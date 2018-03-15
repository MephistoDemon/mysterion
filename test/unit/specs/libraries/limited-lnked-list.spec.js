/* eslint-disable no-unused-expressions */
import LimitedList from '../../../../src/libraries/limited-linked-list'

describe('Limited Linked List', () => {
  const lll = new LimitedList(5)
  lll.insert('some string')
  lll.insert(['some', 'array'])
  lll.insert({some: 'object'})
  lll.insert(2)
  const err = new Error('err')
  lll.insert(err)

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
    expect(lll.oldest).to.be.eql(['some', 'array'])
    expect(lll.newest).to.be.eql('more content')
  })
})
