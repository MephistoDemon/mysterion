// @flow

export interface Plugin {
  install (): void
}

class Plugins {
  plugins: { [string]: Plugin }

  constructor (plugins: { [string]: Plugin }) {
    this.plugins = plugins
  }

  get (name) {
    if (this.plugins[name]) {
      return this.plugins[name]
    }
  }
}

export default Plugins
