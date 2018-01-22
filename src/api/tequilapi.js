import axios from 'axios'

const idPath = '/identities'
const propPath = '/proposals'
const healthcheckPath = '/healthcheck'

export default function (teqAddr = 'http://localhost:4050') {
  const {teqAxio, axioAdapter} = adapterFactory(teqAddr)
  const api = {
    identity: {
      list: async () => axioAdapter.get(idPath),
      create: async (password) => axioAdapter.post(idPath, {password})
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
      const prom = teqAxio.post(path, body)
      const res = await prom
      return res.data
    }
  }
  return {teqAxio, axioAdapter}
}
