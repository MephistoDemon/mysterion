/* @flow */
import fs from 'fs'
import path from 'path'

export const termsFileName = 'terms.html'
export const versionFileName = 'version.txt'

class Terms {
  exportDirectory: string
  termsHtml: string
  version: string

  constructor (termsSrcDir: string, exportDirectory: string) {
    this.exportDirectory = exportDirectory
    this.termsHtml = fs.readFileSync(path.join(termsSrcDir, 'terms.html')).toString()
    this.version = fs.readFileSync(path.join(termsSrcDir, 'termsVersion.txt')).toString()
  }

  isAccepted (): boolean {
    let path = this._getExportedVersionPath()
    if (!fs.existsSync(path)) {
      return false
    }

    try {
      let contents = fs.readFileSync(path).toString()
      return contents === this.version
    } catch (e) {
      console.error('unable to parse user accepted terms version file', e.message)
      return false
    }
  }

  /**
   * @throws exception when write file fails
   */
  accept () {
    fs.writeFileSync(this._getExportedTermsPath(), this.termsHtml)
    fs.writeFileSync(this._getExportedVersionPath(), this.version)
  }

  getContent (): string {
    return this.termsHtml
  }

  getVersion (): string {
    return this.version
  }

  _getExportedVersionPath (): string {
    return path.join(this.exportDirectory, versionFileName)
  }

  _getExportedTermsPath (): string {
    return path.join(this.exportDirectory, termsFileName)
  }
}

export default Terms
