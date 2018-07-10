// @flow

import { exec } from 'child_process'
import sudo from 'sudo-prompt'
import { promisify } from 'util'
import fs from 'fs'

const writeFile = promisify(fs.writeFile)

interface System {
  userExec(command: string): Promise<string>,

  sudoExec(command: string): Promise<string>,

  writeFile(file: string, content: string): Promise<void>,

  readFile(file: string): string,

  fileExists(file: string): boolean
}

class OSSystem implements System {
  userExec (command: string): Promise<string> {
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

  sudoExec (command: string): Promise<string> {
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

  async writeFile (file: string, contents: string): Promise<void> {
    await writeFile(file, contents)
  }

  readFile (file: string): string {
    return fs.readFileSync(file).toString()
  }

  fileExists (file: string) {
    return fs.existsSync(file)
  }
}

export default OSSystem
export type { System }
