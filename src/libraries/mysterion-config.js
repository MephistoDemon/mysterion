import {app} from 'electron'
import path from 'path'

let appContentsPath = path.resolve(app.getAppPath(), '../../')
if (process.env.NODE_ENV === 'development') {
  // path from this file
  appContentsPath = path.resolve(__dirname, '../../')
}

const MysterionConfig = {
  inDevMode: process.env.NODE_ENV === 'development',

  /**
   * mysterium_client binary directory
   */
  clientBinaryPath: path.join(appContentsPath, 'bin', 'mysterium_client'),

  /**
   * mysterium_client configuration files directory
   *
   * e.g. openvpn DNS resolver script
   */
  clientConfigPath: path.join(appContentsPath, 'bin', 'config'),

  /**
   * user data directory
   *
   * This should store logs, terms and conditions file, mysterium_client data, etc
   */
  userDataDirectory: app.getPath('userData'),

  /**
   * runtime/working directory
   *
   * used for storing temp files
   */
  runtimeDirectory: app.getPath('temp'),

  /**
   * static file directory
   */
  staticDirectoryPath: path.join(appContentsPath, 'static').replace(/\\/g, '\\\\'),

  /**
   * window configuration
   */
  windows: {
    url: process.env.NODE_ENV === 'development' ? `http://localhost:9080/` : 'file://src/main/index.html',
    terms: {
      width: (process.env.NODE_ENV === 'development') ? 1000 : 600,
      height: (process.env.NODE_ENV === 'development') ? 700 : 600,
      resizable: process.env.NODE_ENV === 'development'
    },
    app: {
      width: (process.env.NODE_ENV === 'development') ? 1200 : 600,
      height: (process.env.NODE_ENV === 'development') ? 1200 : 600,
      resizable: process.env.NODE_ENV === 'development'
    }
  }
}

export default MysterionConfig
