// @flow

import TrayMenuItem from './menu-item'

class TrayMenuSeparator extends TrayMenuItem {
  constructor () {
    super('separator')
    this.type = 'separator'
  }
}

export default TrayMenuSeparator
