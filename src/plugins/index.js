// @flow

export interface Plugin {
  install (): void
}

export interface Pluggable {
  registerPlugin (Plugin): void
}
