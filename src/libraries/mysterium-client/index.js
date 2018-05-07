import os from 'os'
import LaunchDaemonInstaller from './launch-daemon/installer'
import LaunchDaemonProcess from './launch-daemon/process'
import StandaloneInstaller from './standalone/installer'
import StandaloneProcess from './standalone/process'
import Monitoring from './monitoring'

const logLevel = { LOG: 'stdout', ERROR: 'stderr' }

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

export {Installer, Process, Monitoring, logLevel}
