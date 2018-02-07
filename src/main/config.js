// Setting up paths for binaries and static files.

import {app} from 'electron'
import path from 'path'
import {Config as MysteriumConfig} from '../libraries/mysterium-client'

export default function (global) {
  let appPath = app.getAppPath()
  if (process.env.NODE_ENV === 'development') {
    // path from this file
    appPath = path.resolve(__dirname, '../../')
  }

  global.__static = path.join(appPath, 'static').replace(/\\/g, '\\\\')

  global.__mysteriumClientConfig = new MysteriumConfig(
    path.join(appPath, 'bin', 'mysterium_client'),
    app.getPath('temp'),
    app.getPath('userData')
  )
}
