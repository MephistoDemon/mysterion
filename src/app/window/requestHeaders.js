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

type HeaderRule = {
  urls: Array<string>,

  write(headers: Object): Object
}

function registerHeaderRules (browserSession: Object, rule: HeaderRule) {
  const { urls, write } = rule
  browserSession.webRequest.onBeforeSendHeaders({ urls }, (details, next) => {
    next({ requestHeaders: write(details.requestHeaders) })
  })
}

export default registerHeaderRules
export type { HeaderRule }
