import axios from 'axios'

const idPath = '/identities'
const propPath = '/proposals'
const healthcheckPath = '/healthcheck'

export default function (teqAddr = 'http://localhost:4050') {
  const {teqAxio, axioAdapter} = adapterFactory(teqAddr)
  const api = {
    identity: {
      list: async () => axioAdapter.get(idPath),
      create: async (passphrase) => axioAdapter.post(idPath, {passphrase}),
      unlock: async ({id, passphrase}) => {
        axioAdapter.put(idPath + '/' + id + '/unlock', {passphrase})
      }
    },
    proposal: {
      list: async () => axioAdapter.get(propPath)
    },
    async healthcheck () {
      axioAdapter.get(healthcheckPath)
    },
    __axio: teqAxio // we need this for mocking
  }
  return api
}

function adapterFactory (teqAddr) {
  const teqAxio = axios.create({baseURL: teqAddr})
  const axioAdapter = {
    async get (path) {
      const res = await teqAxio.get(path)
      return res.data
    },
    async post (path, body) {
      const res = await teqAxio.post(path, body)
      return res.data
    },
    async put (path, data, params) {
      const res = await teqAxio.put(path, data, {params})
      return res.data
    }
  }
  return {teqAxio, axioAdapter}
}
