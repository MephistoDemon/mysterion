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

import TrayMenuItem from './menu-item'

class TrayMenu {
  _items: Array<TrayMenuItem> = []

  add (label: string, clickHandler: ?Function, shortcut: ?string, submenu: ?TrayMenu) {
    const item = new TrayMenuItem(label, clickHandler, shortcut, submenu)

    this._items.push(item)

    return item
  }

  addItem (item: TrayMenuItem) {
    this._items.push(item)

    return this
  }

  getItems () {
    return this._items
      .filter((item) => item.visible)
      .map((item) => item.toTrayStructure())
  }
}

export default TrayMenu
