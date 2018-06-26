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

import { ipcMain, ipcRenderer } from 'electron'
import type { SyncReceiver, SyncSender } from './sync'

class SyncIpcReceiver implements SyncReceiver {
  on (channel: string, callback: (data: any) => mixed) {
    ipcMain.on(channel, (event, data) => {
      let returnValue = callback(data)
      // returnValue must be defined for sync ipc call to work
      if (!returnValue) {
        returnValue = true
      }

      // to return some value to sync call, we have to attach it to `event.returnValue`
      event.returnValue = returnValue
    })
  }
}

class SyncIpcSender implements SyncSender {
  send (channel: string, data?: any): mixed {
    return ipcRenderer.sendSync(channel, data)
  }
}

export { SyncIpcSender, SyncIpcReceiver }
