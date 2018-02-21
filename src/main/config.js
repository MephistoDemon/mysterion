// Setting up paths for binaries and static files.

import {app} from 'electron'
import path from 'path'
import {Config as MysteriumConfig} from '../libraries/mysterium-client'

export default function (global) {
  let appContentsPath = path.resolve(app.getAppPath(), '../../')
  if (process.env.NODE_ENV === 'development') {
    // path from this file
    appContentsPath = path.resolve(__dirname, '../../')
  }
  global.__static = path.join(appContentsPath, 'static').replace(/\\/g, '\\\\')
  global.__version = process.env.MYSTERION_VERSION

  global.__mysteriumClientConfig = new MysteriumConfig(
    path.join(appContentsPath, 'bin', 'mysterium_client'),
    path.join(appContentsPath, 'bin', 'config'),
    app.getPath('userData'),
    app.getPath('temp'),
    // TODO migrate to logs directory in later versions, see https://github.com/electron/electron/pull/10191
    app.getPath('userData')
  )
}
