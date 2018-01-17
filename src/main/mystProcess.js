import {app} from 'electron'
let childProcess = require('child_process')

let mystProcess
let commit

function config (_commit) {
  commit = _commit
}

function spawn () {
  if (mystProcess) {
    mystProcess.kill()
  }
  mystProcess = childProcess.spawn(
    global.__mysteriumClientBin,
    ['-runtime-dir', app.getPath('userData')])

  mystProcess.stdout.on('data', (data) => {
    commit('LOG_INFO', data)
    commit('CONNECTED')
  })
  mystProcess.stderr.on('data', (data) => {
    commit('LOG_ERROR', data)
  })
  mystProcess.on('close', () => {
    commit('DISCONNECTED')
  })
}

function kill () {
  mystProcess.kill()
  commit('DISCONNECTED')
}

export default {
  config, spawn, kill
}
