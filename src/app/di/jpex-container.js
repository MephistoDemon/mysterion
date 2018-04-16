// @flow
import type {Container, ServiceFactory} from './index'
import Jpex from 'jpex'

class JpexContainer implements Container {
  jpex: Jpex

  constructor () {
    this.jpex = Jpex.extend()
  }

  get (name: string): mixed {
    return this.jpex.$resolve(name)
  }

  constant (name: string, value: mixed): void {
    this.jpex.register.constant(name, value)
  }

  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void {
    this.jpex.register.service(name, dependencies, factory)
  }
}

export default JpexContainer
