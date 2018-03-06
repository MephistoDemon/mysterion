import fs from 'fs'
import sudo from 'sudo-prompt'
import path from 'path'
import md5 from 'md5'

const DaemonDirectory = '/Library/LaunchDaemons'
const InverseDomainPackageName = 'network.mysterium.mysteriumclient'
const PropertyListFile = InverseDomainPackageName + '.plist'

class Installer {
  constructor (config) {
    this.config = config
  }

  processInstalled () {
    if (fs.existsSync(this.getDaemonFileName())) {
      return true
    }
    return false
  }

  getDaemonFileName () {
    return path.join(DaemonDirectory, PropertyListFile)
  }

  template () {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
      <dict>
        <key>Label</key>
          <string>${InverseDomainPackageName}</string>
          <key>Program</key>
          <string>${this.config.clientBinaryPath}</string>
          <key>ProgramArguments</key>
          <array>
            <string>${this.config.clientBinaryPath}</string>
            <string>--config-dir</string>
            <string>${this.config.clientConfigPath}</string>
            <string>--data-dir</string>
            <string>${this.config.userDataDirectory}</string>
            <string>--runtime-dir</string>
            <string>${this.config.runtimeDirectory}</string>
            <string>--openvpn.binary</string>
            <string>${this.config.openVPNBinary}</string>
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
          <string>${this.config.runtimeDirectory}</string>
          <key>StandardOutPath</key>
          <string>${this.config.userDataDirectory}/stdout.log</string>
          <key>StandardErrorPath</key>
          <string>${this.config.userDataDirectory}/stderr.log</string>
         </dict>
      </plist>`
  }

  pListChecksumMismatch () {
    let templateChecksum = md5(this.template())
    let plistChecksum = md5(fs.readFileSync(this.getDaemonFileName()))
    return templateChecksum !== plistChecksum
  }

  needsInstallation () {
    return !this.exists() || this.pListChecksumMismatch()
  }

  install () {
    let tempPlistFile = path.join(this.config.runtimeDirectory, PropertyListFile)
    let envPath = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin/:'
    let script = `\
      cp ${tempPlistFile} ${this.getDaemonFileName()}\
      && launchctl load ${this.getDaemonFileName()}\
      && launchctl setenv PATH "${envPath}"\
    `
    if (this.processInstalled()) {
      script = `launchctl unload ${this.getDaemonFileName()} && ` + script
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
