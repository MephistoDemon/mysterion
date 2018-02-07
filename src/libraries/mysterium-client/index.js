import os from 'os'
import Config from './config'
import LaunchDaemonInstaller from './launch-daemon/installer'
import LaunchDaemonProcess from './launch-daemon/process'

let Installer, Process

const platform = os.platform()
switch (platform) {
  case 'darwin':
    Installer = LaunchDaemonInstaller
    Process = LaunchDaemonProcess
    break

  default:
    throw new Error('MysteriumClient is not available on platform: ' + platform)
}

export {Config, Installer, Process}
