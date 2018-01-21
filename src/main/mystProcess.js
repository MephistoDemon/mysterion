import {app} from 'electron'
import {spawn} from 'child_process'

function runClient () {
  return spawn(
    global.__mysteriumClientBin,
    ['-runtime-dir', app.getPath('userData')]
  )
}

export default {
  spawn: runClient
}
