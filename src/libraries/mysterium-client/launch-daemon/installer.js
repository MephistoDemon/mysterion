import fs from 'fs'
import sudo from 'sudo-prompt'
import path from 'path'
import md5 from 'md5'

const DaemonDirectory = '/Library/LaunchDaemons'
const InverseDomainPackageName = 'network.mysterium.mysteriumclient'
const PropertyListFile = InverseDomainPackageName + '.plist'

function getDaemonFileName () {
  return path.join(DaemonDirectory, PropertyListFile)
}

function processInstalled () {
  return fs.existsSync(getDaemonFileName())
}

class Installer {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor (config) {
    this.config = config
  }

  template () {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
      <dict>
        <key>Label</key>
          <string>${InverseDomainPackageName}</string>
          <key>Program</key>
          <string>${this.config.clientBin}</string>
          <key>ProgramArguments</key>
          <array>
            <string>${this.config.clientBin}</string>
            <string>--config-dir</string>
            <string>${this.config.configDir}</string>
            <string>--data-dir</string>
            <string>${this.config.dataDir}</string>
            <string>--runtime-dir</string>
            <string>${this.config.runtimeDir}</string>
            <string>--openvpn.binary</string>
            <string>${this.config.openVPNBin}</string>
          </array>
          <key>Sockets</key>
            <dict>
              <key>Listener</key>
              <dict>
                <key>SockType</key>
                <string>stream</string>
                <key>SockServiceName</key>
                <string>4050</string>
              </dict>
            </dict>
          <key>inetdCompatibility</key>
          <dict>
            <key>Wait</key>
            <false/>
          </dict>
          <key>WorkingDirectory</key>
          <string>${this.config.runtimeDir}</string>
          <key>StandardOutPath</key>
          <string>${this.config.logDir}/stdout.log</string>
          <key>StandardErrorPath</key>
          <string>${this.config.logDir}/stderr.log</string>
         </dict>
      </plist>`
  }

  _pListChecksumMismatch () {
    let templateChecksum = md5(this.template())
    let plistChecksum = md5(fs.readFileSync(getDaemonFileName()))
    return templateChecksum !== plistChecksum
  }

  needsInstallation () {
    return !processInstalled() || this._pListChecksumMismatch()
  }

  install () {
    let tempPlistFile = path.join(this.config.runtimeDir, PropertyListFile)
    let envPath = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin/:'
    let script = `\
      cp ${tempPlistFile} ${getDaemonFileName()}\
      && launchctl load ${getDaemonFileName()}\
      && launchctl setenv PATH "${envPath}"\
    `
    if (processInstalled()) {
      script = `launchctl unload ${getDaemonFileName()} && ` + script
    }
    let command = `sh -c '${script}'`

    return new Promise(async (resolve, reject) => {
      await fs.writeFile(tempPlistFile, this.template(), (err) => {
        if (err) {
          reject(new Error('Could not create a temp plist file.'))
        }

        sudo.exec(command.replace(/\n/, ''), {name: 'Mysterion'}, (error, stdout, stderr) => {
          if (error) {
            return reject(error)
          }
          return resolve(stdout)
        })
      })
    })
  }
}

export default Installer
