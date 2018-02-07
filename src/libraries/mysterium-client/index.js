import os from 'os'
import Config from './config'
import LaunchDaemonInstaller from './launch-daemon/installer'
import LaunchDaemonProcess from './launch-daemon/process'
import StandaloneInstaller from './standalone/installer'
import StandaloneProcess from './standalone/process'

let Installer, Process

const platform = os.platform()
switch (platform) {
  case 'darwin':
    Installer = LaunchDaemonInstaller
    Process = LaunchDaemonProcess
    break

  default:
    Installer = StandaloneInstaller
    Process = StandaloneProcess
    break
}

export {Config, Installer, Process}
