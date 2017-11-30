// Setting up paths for binaries and static files.

import {app} from 'electron'
import path from 'path'

export default function (global) {
  if (process.env.NODE_ENV !== 'development') {
    let appPath = app.getAppPath()
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
    global.__mysteriumClientBin = path.resolve(appPath, '../../bin/mysterium_client')
  } else {
    let appPath = path.resolve(__dirname, '../../') // path from this file
    global.__static = require('path').join(appPath, '/static').replace(/\\/g, '\\\\')
    global.__mysteriumClientBin = path.resolve(appPath + '/bin/mysterium_client')
  }
}
