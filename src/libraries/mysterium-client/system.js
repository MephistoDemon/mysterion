// @flow

import { exec } from 'child_process'
import sudo from 'sudo-prompt'
import { promisify } from 'util'
import fs from 'fs'

const writeFile = promisify(fs.writeFile)

class System {
  userExec (command) {
    return new Promise(function (resolve, reject) {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }

        resolve(stdout.trim())
      })
    })
  }

  sudoExec (command) {
    return new Promise(function (resolve, reject) {
      sudo.exec(command, {name: 'Mysterion'}, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }

        resolve(stdout.trim())
      })
    })
  }

  async writeFile (file, contents) {
    await writeFile(file, contents)
  }

  fileExists (file: string) {
    return fs.existsSync(file)
  }
}

export default System
