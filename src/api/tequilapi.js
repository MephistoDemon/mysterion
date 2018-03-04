import axios from 'axios'

const idPath = '/identities'
const propPath = '/proposals'
const conPath = '/connection'
const healthCheckPath = '/healthcheck'
const stopPath = '/stop'

const timeout = 5000

export const types = {
  connection: {
    CONNECTED: 'Connected',
    NOT_CONNECTED: 'NotConnected',
    DISCONNECTING: 'Disconnecting',
    CONNECTING: 'Connecting'
  }
}

export let tequilapi = Constructor()

export default function Constructor (teqAddr = 'http://127.0.0.1:4050') {
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
      ip: async () => {
        try {
          const res = await axioAdapter.get(conPath + '/ip')
          return res.ip
        } catch (err) {
          if (err.response && err.response.status === 503) {
            return null
          } else {
            throw err
          }
        }
      },
      statistics: async () => axioAdapter.get(conPath + '/statistics')
    },
    healthCheck: async (timeout) => axioAdapter.get(healthCheckPath, {timeout}),
    stop: async () => axioAdapter.post(stopPath),
    __axio: teqAxio // we need this for mocking
  }
  return api
}

function adapterFactory (teqAddr) {
  const teqAxio = axios.create({baseURL: teqAddr, timeout})
  const axioAdapter = {
    async get (path, options = {}) {
      const res = await teqAxio.get(path, options)
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
  return {
    teqAxio,
    axioAdapter
  }
}
