/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { bytesReadable, timeDisplay } from '../../../src/libraries/unitConverter'

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
