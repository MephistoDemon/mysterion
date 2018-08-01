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

type ClientConfig = {
  /**
   * 'mysterium_client' binary path
   */
  clientBin: string,

  /**
   * 'mysterium_client' configuration files directory e.g. openvpn DNS resolver script
   */
  configDir: string,

  /**
   * 'openvpn' binary path
   */
  dataDir: string,

  /**
   * User data directory for 'mysterium_client' data, etc.
   */
  openVPNBin: string,

  /**
   * Runtime/working directory, used for storing temp files
   */
  runtimeDir: string,

  /**
   * Directory to store 'mysterium_client' logs
   */
  logDir: string,

  /**
   * Stdout log file name
   */
  stdOutFileName: string,

  /**
   * Stderr log file name
   */
  stdErrFileName: string,

  /**
   * System log file path
   */
  systemLogPath: ?string,

  /**
   * Port on which to launch Tequilapi requests
   */
  tequilapiPort: number
}

export type { ClientConfig }
