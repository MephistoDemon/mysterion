import fs from 'fs'
import path from 'path'
import bugReporter from '../../main/bug-reporting'

const TermsFileName = 'terms.json'

class Terms {
  constructor (directory, content, version) {
    this.directory = directory
    this.content = content
    this.version = version
  }

  accepted () {
    let path = this._getTermsPath()
    if (!fs.existsSync(path)) {
      return false
    }

    try {
      let contents = JSON.parse(fs.readFileSync(path))
      return contents.version === this.version
    } catch (e) {
      bugReporter.main.Raven.captureException(e)
      console.error('unable to parse terms JSON', e.message)
      return false
    }
  }

  store () {
    let contents = JSON.stringify({
      content: this.content,
      version: this.version
    })

    try {
      fs.writeFileSync(this._getTermsPath(), contents)
    } catch (e) {
      throw new Error('Failed to store terms.')
    }
  }

  getContent () {
    return this.content
  }

  getVersion () {
    return this.version
  }

  _getTermsPath () {
    return path.join(this.directory, TermsFileName)
  }
}

export default Terms
