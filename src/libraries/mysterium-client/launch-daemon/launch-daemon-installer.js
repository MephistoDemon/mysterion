/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow

import fs from 'fs'
import sudo from 'sudo-prompt'
import path from 'path'
import md5 from 'md5'
import type { ClientConfig } from '../config'
import type { Installer } from '../index'
import { INVERSE_DOMAIN_PACKAGE_NAME, LAUNCH_DAEMON_PORT, PROPERTY_LIST_FILE, PROPERTY_LIST_NAME } from './config'
import { promisify } from 'util'
import createFileIfMissing from '../../create-file-if-missing'

const writeFile = promisify(fs.writeFile)
// TODO: check if sudo.exec promisifying works as expected
const sudoExec = promisify(sudo.exec)

const SUDO_PROMT_PERMISSION_DENIED = 'User did not grant permission.'

function processInstalled () {
  return fs.existsSync(PROPERTY_LIST_FILE)
}

class LaunchDaemonInstaller implements Installer {
  _config: ClientConfig

  constructor (config: ClientConfig) {
    this._config = config
  }

  template (): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
        <dict>
        <key>EnvironmentVariables</key>
        <dict>
            <key>PATH</key>
            <string>/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin/:</string>
        </dict>
        <key>Label</key>
          <string>${INVERSE_DOMAIN_PACKAGE_NAME}</string>
          <key>Program</key>
          <string>${this._config.clientBin}</string>
          <key>ProgramArguments</key>
          <array>
            <string>${this._config.clientBin}</string>
            <string>--config-dir</string>
            <string>${this._config.configDir}</string>
            <string>--data-dir</string>
            <string>${this._config.dataDir}</string>
            <string>--runtime-dir</string>
            <string>${this._config.runtimeDir}</string>
            <string>--openvpn.binary</string>
            <string>${this._config.openVPNBin}</string>
            <string>--tequilapi.port</string>
            <string>${this._config.tequilapiPort}</string>
          </array>
          <key>Sockets</key>
            <dict>
              <key>Listener</key>
              <dict>
                <key>SockType</key>
                <string>stream</string>
                <key>SockServiceName</key>
                <string>${LAUNCH_DAEMON_PORT}</string>
              </dict>
            </dict>
          <key>inetdCompatibility</key>
          <dict>
            <key>Wait</key>
            <false/>
          </dict>
          <key>WorkingDirectory</key>
          <string>${this._config.runtimeDir}</string>
          <key>StandardOutPath</key>
          <string>${this._config.logDir}/${this._config.stdOutFileName}</string>
          <key>StandardErrorPath</key>
          <string>${this._config.logDir}/${this._config.stdErrFileName}</string>
         </dict>
      </plist>`
  }

  async needsInstallation (): Promise<boolean> {
    return !processInstalled() || this._pListChecksumMismatch()
  }

  async install (): Promise<void> {
    let tempPlistFile = path.join(this._config.runtimeDir, PROPERTY_LIST_NAME)
    let script = `\
      cp ${tempPlistFile} ${PROPERTY_LIST_FILE}\
      && launchctl load ${PROPERTY_LIST_FILE}\
    `
    if (processInstalled()) {
      script = `launchctl unload ${PROPERTY_LIST_FILE} && ` + script
    }
    let command = `sh -c '${script}'`.replace(/\n/, '')

    await writeFile(tempPlistFile, this.template())
    await sudoExec(command, { name: 'Mysterion' })
    await this._createLogFilesIfMissing()
  }

  _pListChecksumMismatch (): boolean {
    let templateChecksum = md5(this.template())
    let plistChecksum = md5(fs.readFileSync(PROPERTY_LIST_FILE))

    return templateChecksum !== plistChecksum
  }

  async _createLogFilesIfMissing (): Promise<void> {
    await createFileIfMissing(path.join(this._config.logDir, this._config.stdOutFileName))
    await createFileIfMissing(path.join(this._config.logDir, this._config.stdErrFileName))
  }
}

export default LaunchDaemonInstaller
export { SUDO_PROMT_PERMISSION_DENIED }
