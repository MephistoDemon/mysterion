/* eslint-disable no-unused-expressions */
import {bootstrap} from '../../../../src/main/dependencies/index'
import JpexContainer from '../../../../src/app/di/jpex-container'

describe('MainDependencies', () => {
  it('bootstrap', () => {
    const container = bootstrap()

    expect(container).to.exist
    expect(container).to.be.an.instanceOf(JpexContainer)
  })
})
