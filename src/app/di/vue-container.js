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
import Vue from 'vue'
import Injector from 'vue-inject'
import constants from 'jpex/src/constants'

/**
 * Implementation of DI container which is Vue plugin at the same time.
 */
class VueContainer implements Container {
  injector: Injector

  constructor (vueInstance: Vue) {
    this.injector = Injector.extend({
      // Once per class. Every instance of that class will use the same factory instance,
      // but any parent or child classes will create a new instance.
      defaultLifecycle: constants.CLASS
    })
    vueInstance.use(this.injector)
  }

  get (name: string): mixed {
    return this.injector.get(name)
  }

  constant (name: string, value: mixed): void {
    this.injector.constant(name, value)
  }

  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void {
    this.injector.service(name, dependencies, factory)
  }

  factory (name: string, dependencies: Array<string>, factory: ServiceFactory): void {
    this.injector.factory(name, dependencies, factory)
  }
}

export default VueContainer
