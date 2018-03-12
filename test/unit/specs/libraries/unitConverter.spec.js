import {bytesReadable, timeDisplay} from '../../../../src/libraries/unitConverter'

describe('BytesReadable', () => {
  it('returns object with value (fixed 2 decimals) and units ', () => {
    const val = 123
    const result = bytesReadable(val)
    expect(result.units).to.eql('Bytes')
    expect(result.value).to.eql('123.00')
  })

  it('calculates one Byte correctly', () => {
    const val = 1
    const result = bytesReadable(val)
    expect(result.units).to.eql('Byte')
    expect(result.value).to.eql('1.00')
  })

  it('calculates one KB correctly', () => {
    const val = 1024
    const result = bytesReadable(val)
    expect(result.units).to.eql('KB')
    expect(result.value).to.eql('1.00')
  })

  it('calculates one MB correctly', () => {
    const val = 1024 * 1024
    const result = bytesReadable(val)
    expect(result.units).to.eql('MB')
    expect(result.value).to.eql('1.00')
  })

  it('calculates one GB correctly', () => {
    const val = 1024 * 1024 * 1024
    const result = bytesReadable(val)
    expect(result.units).to.eql('GB')
    expect(result.value).to.eql('1.00')
  })

  it('calculates one TB correctly', () => {
    const val = 1024 * 1024 * 1024 * 1024
    const result = bytesReadable(val)
    expect(result.units).to.eql('TB')
    expect(result.value).to.eql('1.00')
  })

  it('returns 0', () => {
    expect(bytesReadable(0).value).to.eql('0.00')
  })
  it('throws', () => {
    expect(() => bytesReadable()).to.throw('provide valid input for conversion')
    expect(() => bytesReadable('str')).to.throw('provide valid input for conversion')
  })
})

describe('time display', () => {
  it('converts time correnctly', () => {
    expect(timeDisplay(60 * 60 + 60 + 1)).to.be.eql('01:01:01')
    expect(timeDisplay(60 * 60 * 24 * 5)).to.be.eql('120:00:00')
  })
  it('throws invalid parameter types', () => {
    expect(() => timeDisplay(null)).to.throw('invalid input')
    expect(() => timeDisplay(undefined)).to.throw('invalid input')
    expect(() => timeDisplay('some string')).to.throw('invalid input')
    expect(() => timeDisplay(-10)).to.throw('invalid input')
  })
})
