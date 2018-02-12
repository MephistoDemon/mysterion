import fs from 'fs'
import sudo from 'sudo-prompt'
import path from 'path'

const DaemonDirectory = '/Library/LaunchDaemons'
const PropertyListFile = 'network.mysterium.mysteriumclient.plist'

class Installer {
  constructor (config) {
    this.config = config
  }

  exists () {
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
          <string>net.mysterium.client.mysteriumclient</string>
          <key>Program</key>
          <string>${this.config.clientBin}</string>
          <key>ProgramArguments</key>
          <array>
            <string>--config-dir</string>
            <string>${this.config.configDir}</string>
            <string>--runtime-dir</string>
            <string>${this.config.runtimeDir}</string>
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
          <key>StandardOutPath</key>
          <string>${this.config.logDir}/stdout.log</string>
          <key>StandardErrorPath</key>
          <string>${this.config.logDir}/stderr.log</string>
         </dict>
      </plist>`
  }

  install () {
    let tempPlistFile = path.join(this.config.runtimeDir, PropertyListFile)
    let envPath = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/local/sbin/:'
    let command = `sh -c '
      cp ${tempPlistFile} ${this.getDaemonFileName()} \
      && launchctl load ${this.getDaemonFileName()} \
      && launchctl setenv PATH "${envPath}" \
    '`

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
