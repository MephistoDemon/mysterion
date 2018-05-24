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
import type {Container, ServiceFactory} from './index'
import Jpex from 'jpex'
import constants from 'jpex/src/constants'

/**
 * Implementation of DI container which works via Jpex library.
 */
class JpexContainer implements Container {
  jpex: Jpex

  constructor () {
    this.jpex = Jpex.extend({
      // Once per class. Every instance of that class will use the same factory instance,
      // but any parent or child classes will create a new instance.
      defaultLifecycle: constants.CLASS
    })
  }

  get (name: string): any {
    return this.jpex.$resolve(name)
  }

  constant (name: string, value: any): void {
    this.jpex.register.constant(name, value)
  }

  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void {
    this.jpex.register.service(name, dependencies, factory)
  }

  factory (name: string, dependencies: Array<string>, factory: ServiceFactory): void {
    this.jpex.register.factory(name, dependencies, factory)
  }
}

export default JpexContainer
