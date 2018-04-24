// @flow

// Factory this creates named instance
export type ServiceFactory = (...dependencies: Array<mixed>) => mixed

// DI Container which holds list of named instances
export interface Container {
  get (name: string): mixed,
  constant (name: string, value: mixed): void,
  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void,
}
