import {bytesReadable, timeDisplay} from '../../../../src/libraries/unitConverter'

describe('BytesReadable', () => {
  it('returns object with value (fixed 2 decimals) and units ', () => {
    const val = 123
    const result = bytesReadable(val)
    expect(result).to.have.property('value')
    expect(result).to.have.property('units')
    expect(result.units).to.eql('Bytes')
    expect(result.value).to.eql('123.00')
    expect(result.value).to.be.a('string')
  })

  it('can do units: KB, MB, TB, GB', () => {
    expect(bytesReadable(1e12).units).to.be.eql('TB')
    expect(bytesReadable(1e9).units).to.be.eql('GB')
    expect(bytesReadable(1e6).units).to.be.eql('MB')
    expect(bytesReadable(1e3).units).to.be.eql('kB')
  })
})

describe('BytesReadable time display', () => {
  it('converts time correnctly', () => {
    expect(timeDisplay(60 * 60 + 60 + 1)).to.be.eql('01:01:01')
    expect(timeDisplay(60 * 60 * 24 * 5)).to.be.eql('120:00:00')
  })
  it('returns --:--:-- on invalid parameter types', () => {
    expect(timeDisplay(null)).to.be.eql('--:--:--')
    expect(timeDisplay(undefined)).to.be.eql('--:--:--')
    expect(timeDisplay('some string')).to.be.eql('--:--:--')
    expect(timeDisplay(-10)).to.be.eql('--:--:--')
  })
})
