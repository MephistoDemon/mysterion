/**
 * Returns a promise that is resolved after a given period of time
 * @param {number} time - time to take for promise resolution
 * @returns {Promise<any>}
 */
function sleep (time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time)
  })
}

export { sleep }
