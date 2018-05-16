// @flow

// Factory this creates named instance
export type ServiceFactory = (...dependencies: Array<any>) => any

// DI Container which holds list of named instances
export interface Container {
  get (name: string): any,
  constant (name: string, value: any): void,
  service (name: string, dependencies: Array<string>, factory: ServiceFactory): void,
  factory (name: string, dependencies: Array<string>, factory: ServiceFactory, cache: ?boolean): void
}
