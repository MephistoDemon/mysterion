// @flow

export type ServiceFactory = (...dependencies: Array<mixed>) => mixed

export interface Container {
  get (name: string): mixed,
  constant (name: string, value: mixed): void,
  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void,
}
