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

import LimitedLinkedList from '../../libraries/limited-linked-list'
import {logLevels} from '../../libraries/mysterium-client'

const logsBuffer = {
  [logLevels.LOG]: new LimitedLinkedList(300),
  [logLevels.ERROR]: new LimitedLinkedList(300)
}

const pushToLogCache = (level, data) => {
  logsBuffer[level].insert(data)
}

const getLogCache = (level) => {
  return logsBuffer[level].toArray().reverse().join('\n')
}

export { pushToLogCache, getLogCache }
