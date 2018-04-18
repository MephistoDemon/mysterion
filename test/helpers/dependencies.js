// @flow

/**
 * These functions are available in specs without explicitly importing them,
 * but static typing needs these explicit declarations.
 */

// mocha
declare var describe: Function
declare var it: Function
declare var before: Function
declare var beforeEach: Function

// chai
declare var expect: Function

export { describe, it, expect, before, beforeEach }
