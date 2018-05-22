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

/**
 * These functions are available in specs without explicitly importing them,
 * but static typing needs these explicit declarations.
 */

// mocha
declare var describe: Function
declare var before: Function
declare var beforeEach: Function
declare var after: Function
declare var it: Function

// chai
declare var expect: Function

export { describe, before, beforeEach, after, it, expect }
