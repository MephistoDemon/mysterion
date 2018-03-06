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
   * mysterium_client binary path
   */
  clientBinaryPath: path.join(appContentsPath, 'bin', 'mysterium_client'),

  /**
   * openvpn binary path
   */
  openVPNBinary: path.join(appContentsPath, 'bin', 'openvpn'),

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
  staticDirectoryPath: process.env.NODE_ENV === 'development'
    ? path.join(appContentsPath, 'static').replace(/\\/g, '\\\\')
    : path.join(app.getAppPath(), '../', 'static').replace(/\\/g, '\\\\'),

  /**
   * window configuration
   */
  windows: {
    url: process.env.NODE_ENV === 'development' ? `http://localhost:9080/` : `file://${__dirname}/index.html`,
    terms: {
      width: 800,
      height: 650
    },
    app: {
      width: 650,
      height: 650
    }
  }
}

export default MysterionConfig
