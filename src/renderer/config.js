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

export default {
  statusUpdateThreshold: 300,
  statisticsUpdateThreshold: 300,
  ipUpdateThreshold: 10000,
  ipUpdateTimeout: 5000,
  locationUpdateTimeout: 5000,
  initializationSleepBetweenRetries: 3000,
  initializationMaxRetries: 10 // 3000ms*10=30s trying to initialize
}
