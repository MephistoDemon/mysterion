import size from 'file-size'

function bytesReadable (val) {
  if (!val) return { value: val, units: 'kB' }
  else {
    const calculated = size(val).calculate('si')
    return { value: calculated.fixed, units: calculated.suffix }
  }
}

const timeDisplay = val => {
  if (!val || typeof val !== 'number' || val < 0) {
    return '--:--:--'
  } else {
    let h = Math.floor(val / 3600)
    h = h > 9 ? h : '0' + h
    let m = Math.floor((val % 3600) / 60)
    m = m > 9 ? m : '0' + m
    let s = (val % 60)
    s = s > 9 ? s : '0' + s
    return `${h}:${m}:${s}`
  }
}

export {
  /**
   * @function
   * @param {number} val
   * @returns {ValueAndUnits} result - holds value and units
   */
  bytesReadable,
  /**
   * @function
   * @param {number} val
   * @returns {string} readable in --:--:-- format
   */
  timeDisplay
}

/**
 * @typedef {Object} ValueAndUnits
 * @property {string} val - Value
 * @property {string} unit - units
 */
