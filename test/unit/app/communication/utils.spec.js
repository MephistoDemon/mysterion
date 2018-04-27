import {onFirstEvent} from '../../../../src/app/communication/utils'

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
