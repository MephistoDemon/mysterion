/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
