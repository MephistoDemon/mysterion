/* eslint-disable no-unused-expressions */
import Terms, {termsFileName} from '../../../../src/app/terms/index'
import fs from 'fs'
import path from 'path'
import util from 'util'
import dir from '../../../helpers/directory'

const unlinkAsync = util.promisify(fs.unlink)
const rmDirAsync = util.promisify(fs.rmdir)

const mockDir = './test/mock/terms'
const termsSrcDir = './static/terms'

describe('Terms', () => {
  const terms = new Terms(termsSrcDir, mockDir)
  terms.load()

  before(() => {
    dir.make(mockDir)
  })

  after(async () => {
    await unlinkAsync(path.join(mockDir, termsFileName))
    await rmDirAsync(mockDir)
  })

  it('can save terms html and version to destination folder', () => {
    terms.accept()
    expect(terms.isAccepted()).to.be.true
    expect(fs.existsSync(path.join(mockDir, termsFileName))).to.be.true
  })

  it('validates version of accepted terms', () => {
    fs.writeFileSync(terms._getExportedTermsPath(), 'fake terms')
    expect(terms.isAccepted()).to.be.false
  })
})
