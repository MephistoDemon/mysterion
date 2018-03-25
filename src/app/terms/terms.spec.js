/* eslint-disable no-unused-expressions */
import Terms, {termsFileName, versionFileName} from './index'
import fs from 'fs'
import path from 'path'
import util from 'util'

const unlinkAsync = util.promisify(fs.unlink)
const rmDirAsync = util.promisify(fs.rmdir)

const mockDir = './test/mock/terms'
const termsSrcDir = './static/terms'

describe('Terms', () => {
  const terms = new Terms(termsSrcDir, mockDir)

  before(function (done) {
    fs.mkdir(mockDir, done)
  })

  after(async function () {
    await unlinkAsync(path.join(mockDir, termsFileName))
    await unlinkAsync(path.join(mockDir, versionFileName))
    await rmDirAsync(mockDir)
  })

  it('can save terms html and version to destination folder', () => {
    terms.accept()
    expect(terms.isAccepted()).to.be.true
    expect(fs.existsSync(path.join(mockDir, termsFileName))).to.be.true
    expect(fs.existsSync(path.join(mockDir, versionFileName))).to.be.true
  })

  it('validates version of accepted terms', () => {
    fs.writeFileSync(terms._getExportedVersionPath(), 'fake version')
    expect(terms.isAccepted()).to.be.false
  })
})
