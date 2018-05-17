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
      defaultLifecicles: constants.CLASS
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

  factory (name: string, dependencies: Array<string>, factory: ServiceFactory, cache: ?boolean): void {
    const factoryWrapper = this.jpex.register.factory(name, dependencies, factory)
    if (cache) factoryWrapper.lifecycle.application()
  }
}

export default JpexContainer
