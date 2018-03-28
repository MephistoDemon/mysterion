/* @flow */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const termsFileName = 'terms.html'

function stringHashesMatch (userAcceptedTerms: string, currentTerms: string) {
  const userAcceptedTermsHash = crypto.createHash('md5').update(userAcceptedTerms).digest('hex')
  const currentTermsHash = crypto.createHash('md5').update(currentTerms).digest('hex')
  return userAcceptedTermsHash === currentTermsHash
}

class Terms {
  _termsSrcDir: string
  exportDir: string
  termsHtml: string

  constructor (termsSrcDir: string, exportDirectory: string) {
    this.exportDir = exportDirectory
    this._termsSrcDir = termsSrcDir
  }

  load () {
    this.termsHtml = fs.readFileSync(path.join(this._termsSrcDir, termsFileName)).toString()
  }

  /**
   * @throws exception when exported version file reading fails
   */
  isAccepted (): boolean {
    let path = this._getExportedTermsPath()
    if (!fs.existsSync(path)) {
      return false
    }

    let acceptedContents = fs.readFileSync(path).toString()
    return stringHashesMatch(acceptedContents, this.termsHtml)
  }

  /**
   * @throws exception when write file fails
   */
  accept () {
    fs.writeFileSync(this._getExportedTermsPath(), this.termsHtml)
  }

  /**
   * @throws exception when this.termsHtml is falsy
   */
  getContent (): string {
    if (!this.termsHtml) throw new Error('Trying to get terms content, but termsHtml is undefined. Must do load() first')
    return this.termsHtml
  }

  _getExportedTermsPath (): string {
    return path.join(this.exportDir, termsFileName)
  }
}

export default Terms
