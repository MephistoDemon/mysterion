import size from 'file-size'

/**
 * @function
 * @param {number} val
 * @returns {{value:number,units:string}} result - holds value and units
 * @throws if argument is null
 */

function bytesReadable (val) {
  if (typeof val !== 'number') {
    throw new Error('provide valid input for conversion')
  }
  const calculated = size(val).calculate('si')
  return {value: calculated.fixed, units: calculated.suffix}
}

/**
 * @function
 * @param {number} val
 * @returns {string} readable in --:--:-- format
 * @throws {Error} if argument is null
 */
function timeDisplay (val) {
  if (typeof val !== 'number' || val < 0) {
    throw new Error('invalid input')
  }
  let h = Math.floor(val / 3600)
  h = h > 9 ? h : '0' + h
  let m = Math.floor((val % 3600) / 60)
  m = m > 9 ? m : '0' + m
  let s = (val % 60)
  s = s > 9 ? s : '0' + s
  return `${h}:${m}:${s}`
}

export {
  bytesReadable,
  timeDisplay
}
