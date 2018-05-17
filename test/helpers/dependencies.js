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
