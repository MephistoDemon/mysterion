import axios from 'axios'

const timeout = 5000

const idPath = '/identities'
const propPath = '/proposals'
const conPath = '/connection'
const healthcheckPath = '/healthcheck'
const stopPath = '/stop'

export default function (teqAddr = 'http://127.0.0.1:4050') {
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
    connection: {
      connect: async ({consumerId, providerId}) => axioAdapter.put(conPath, {
        consumerId: consumerId,
        providerId: providerId
      }),
      disconnect: async () => axioAdapter.delete(conPath),
      status: async () => axioAdapter.get(conPath),
      ip: async () => axioAdapter.get(conPath + '/ip'),
      statistics: async () => axioAdapter.get(conPath + '/statistics')
    },
    async healthcheck () {
      axioAdapter.get(healthcheckPath)
    },
    stop: async () => axioAdapter.post(stopPath),
    __axio: teqAxio // we need this for mocking
  }
  return api
}

function adapterFactory (teqAddr) {
  const teqAxio = axios.create({baseURL: teqAddr, timeout: timeout})
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
    },
    async delete (path) {
      const res = await teqAxio.delete(path)
      return res.data
    }
  }
  return {teqAxio, axioAdapter}
}
