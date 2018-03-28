/* @flow */
import path from 'path'
import fs from 'fs'

export function make (targetDir: string): void {
  const sep = path.sep
  const initDir = path.isAbsolute(targetDir) ? sep : ''
  const baseDir = '.'

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir)
    try {
      fs.mkdirSync(curDir)
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
    }
    return curDir
  }, initDir)
}

export default {make}
