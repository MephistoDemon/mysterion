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

type WindowSizeConfig = {
  width: number,
  height: number
}

type MysterionWindowsConfig = {
  terms: WindowSizeConfig,
  app: WindowSizeConfig
}

type MysterionConfig = {
  // Application root directory
  contentsDirectory: string,
  // User data directory. This should store logs, terms and conditions file, etc.
  userDataDirectory: string,
  // Runtime/working directory, used for storing temp files
  runtimeDirectory: string,
  // Static file directory
  staticDirectory: string,
  // Window configuration
  windows: MysterionWindowsConfig
}

export type { MysterionConfig, MysterionWindowsConfig, WindowSizeConfig }
