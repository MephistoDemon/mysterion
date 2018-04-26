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
