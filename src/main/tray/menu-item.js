// @flow

import TrayMenu from './menu'

class TrayMenuItem {
  label: string
  click: ?Function
  shortcut: ?string
  submenu: ?TrayMenu
  visible: boolean = true
  enabled: boolean = true
  type: string

  constructor (label: string, clickHandler: ?Function, shortcut: ?string, submenu: ?TrayMenu) {
    this.label = label
    this.click = clickHandler
    this.shortcut = shortcut
    this.submenu = submenu
  }

  setLabel (label: string): this {
    this.label = label

    return this
  }

  show (): this {
    this.visible = true

    return this
  }

  hide (): this {
    this.visible = false

    return this
  }

  enable (): this {
    this.enabled = true

    return this
  }

  disable (): this {
    // this doesn't work for items with submenus
    this.enabled = false

    return this
  }

  toTrayStructure () {
    return {
      label: this.label,
      click: this.click,
      accelerator: this.shortcut,
      visible: this.visible,
      submenu: this.submenu ? this.submenu.getItems() : null,
      enabled: this.enabled,
      type: this.type
    }
  }
}

export default TrayMenuItem
