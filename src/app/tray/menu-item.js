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

  /**
   * @param label
   * @param clickHandler
   * @param shortcut
   * @param submenu
   */
  constructor (label: string, clickHandler: ?Function, shortcut: ?string, submenu: ?TrayMenu) {
    this.label = label
    this.click = clickHandler
    this.shortcut = shortcut
    this.submenu = submenu
  }

  /**
   * @param label
   *
   * @returns {TrayMenuItem}
   */
  setLabel (label: string): this {
    this.label = label

    return this
  }

  /**
   * @returns {TrayMenuItem}
   */
  show (): this {
    this.visible = true

    return this
  }

  /**
   * @returns {TrayMenuItem}
   */
  hide (): this {
    this.visible = false

    return this
  }

  /**
   * @returns {TrayMenuItem}
   */
  enable (): this {
    this.enabled = true

    return this
  }

  /**
   * @returns {TrayMenuItem}
   */
  disable (): this {
    // this doesn't work for items with submenus
    this.enabled = false

    return this
  }

  /**
   * Converts internal properties to electron tray menu item properties
   *
   * @returns {{label: string, click: Function, accelerator: string, submenu: *}}
   */
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
