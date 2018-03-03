const editJsonFile = require('edit-json-file')
const git = require('git-rev')

const packagejson = editJsonFile('./package.json')

git.tag((str) => {
  packagejson.set('version', str)
  packagejson.save()
})