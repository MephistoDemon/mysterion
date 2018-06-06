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

import os from 'os'
import LaunchDaemonInstaller from './launch-daemon/installer'
import LaunchDaemonProcess from './launch-daemon/process'
import StandaloneInstaller from './standalone/installer'
import StandaloneProcess from './standalone/process'
import Monitoring from './monitoring'
import logLevels from './log-levels'

let Installer, Process

const platform = os.platform()
// TODO: extract Installer interface, move this logic into function (i.e. getInstaller()) or DI
switch (platform) {
  case 'darwin':
    Installer = LaunchDaemonInstaller
    Process = LaunchDaemonProcess
    break

  default:
    Installer = StandaloneInstaller
    Process = StandaloneProcess
    break
}

export {Installer, Process, Monitoring, logLevels}
