import fs from 'fs'
import Sudo from 'sudo-prompt'
import path from 'path'

const DaemonDirectory = '/Library/LaunchDaemons'
const PropertyListFile = 'net.mysterium.client.mysteriumclient'

class Daemon {
  constructor (workingDir, logDir, clientPath) {
    this.logDir = logDir
    this.clientPath = clientPath
    this.workingDir = workingDir
  }

  exists () {
    if (fs.existsSync(this.getDaemonFileName())) {
      return true
    }
    return false
  }

  getDaemonFileName () {
    return path.join(DaemonDirectory, PropertyListFile + '.plist')
  }

  template () {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
         <dict>
             <key>Label</key>
             <string>net.mysterium.client.mysteriumclient</string>
             <key>Program</key>
             <string>${this.clientPath}</string>
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
             <key>Debug</key>
             <true/>
            <key>inetdCompatibility</key>
            <dict>
             <key>Wait</key>
             <false/>
            </dict>
            <key>StandardOutPath</key>
            <string>${this.logDir}/stdout.log</string>
            <key>StandardErrorPath</key>
            <string>${this.logDir}/stderr.log</string>
         </dict>
      </plist>`

    return template
  }

  install () {
    let tempPlistFile = path.join(this.workingDir, 'mysterium.plist')

    fs.writeFileSync(tempPlistFile, this.template())

    let command = `sh -c 'cp ${tempPlistFile} ${this.getDaemonFileName()} && launchctl load ${this.getDaemonFileName()}'`
    return new Promise((resolve, reject) => {
      Sudo.exec(command, {name: 'Mysterion'}, (error, stdout, stderr) => {
        fs.unlink(tempPlistFile)
        if (error) {
          return reject(error)
        }
        return resolve(stdout)
      })
    })
  }
}

export default Daemon
