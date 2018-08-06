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

// @flow

class PublicKeyDTO {
  part1: string
  part2: string

  constructor (data: Object) {
    this.part1 = data.Part1
    this.part2 = data.Part2
  }
}

class SignatureDTO {
  r: string
  s: string
  v: string

  constructor (data: Object) {
    this.r = data.R
    this.s = data.S
    this.v = data.V
  }
}

class IdentityRegistrationDTO {
  registered: string
  publicKey: PublicKeyDTO
  signature: SignatureDTO

  constructor (data: Object) {
    this.registered = data.Registered
    this.publicKey = new PublicKeyDTO(data.PublicKey || {})
    this.signature = new SignatureDTO(data.Signature || {})
  }
}

export type { PublicKeyDTO, SignatureDTO }
export default IdentityRegistrationDTO
