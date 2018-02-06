import os from 'os'
import LaunchDaemonInstaller from './launch-daemon/installer'

let Installer

const platform = os.platform()
switch (platform) {
  case 'darwin':
    Installer = LaunchDaemonInstaller
    break

  default:
    throw new Error('MysteriumClient is not available on platform: ' + platform)
}

export default Installer
