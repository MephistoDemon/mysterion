/* @flow */
import fs from 'fs'
import path from 'path'

export const termsFileName = 'terms.html'
export const versionFileName = 'termsVersion.txt'

class Terms {
  _termsSrcDir: string
  exportDir: string
  termsHtml: string
  version: string

  constructor (termsSrcDir: string, exportDirectory: string) {
    this.exportDir = exportDirectory
    this._termsSrcDir = termsSrcDir
  }

  load () {
    this.termsHtml = fs.readFileSync(path.join(this._termsSrcDir, termsFileName)).toString()
    this.version = fs.readFileSync(path.join(this._termsSrcDir, versionFileName)).toString()
  }

  /**
   * @throws exception when exported version file reading fails
   */
  isAccepted (): boolean {
    let path = this._getExportedVersionPath()
    if (!fs.existsSync(path)) {
      return false
    }

    let contents = fs.readFileSync(path).toString()
    return contents === this.version
  }

  /**
   * @throws exception when write file fails
   */
  accept () {
    fs.writeFileSync(this._getExportedTermsPath(), this.termsHtml)
    fs.writeFileSync(this._getExportedVersionPath(), this.version)
  }

  /**
   * @throws exception when this.termsHtml is falsy
   */
  getContent (): string {
    if (!this.termsHtml) throw new Error('Trying to get terms content, but termsHtml is undefined. Must do load() first')
    return this.termsHtml
  }

  /**
   * @throws exception when this.version is falsy
   */
  getVersion (): string {
    if (!this.version) throw new Error('Trying to get terms version, but version is undefined. Must do load() first')
    return this.version
  }

  _getExportedVersionPath (): string {
    return path.join(this.exportDir, versionFileName)
  }

  _getExportedTermsPath (): string {
    return path.join(this.exportDir, termsFileName)
  }
}

export default Terms
