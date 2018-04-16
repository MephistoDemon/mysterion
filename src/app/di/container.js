// @flow
import Jpex from 'jpex'

type ServiceFactory = (...dependencies: Array<mixed>) => mixed

export interface Container {
  get (name: string): mixed,
  constant (name: string, value: mixed): void,
  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void,
}

class JpexContainer implements Container {
  jpex: Jpex

  constructor () {
    this.jpex = Jpex.extend()
  }

  get (name: string): mixed {
    this.jpex.$resolve(name)
  }

  constant (name: string, value: mixed): void {
    this.jpex.register.constant(name, value)
  }

  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void {
    this.jpex.register.service(name, dependencies, factory)
  }
}

export default JpexContainer
