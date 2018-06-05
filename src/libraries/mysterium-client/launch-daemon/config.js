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

import path from 'path'

export const INVERSE_DOMAIN_PACKAGE_NAME = 'network.mysterium.mysteriumclient'
export const PROPERTY_LIST_NAME = INVERSE_DOMAIN_PACKAGE_NAME + '.plist'
export const PROPERTY_LIST_FILE = path.join('/Library/LaunchDaemons', PROPERTY_LIST_NAME)
// Port on which to launch daemon managing Tequilapi
export const LAUNCH_DAEMON_PORT = 4051
