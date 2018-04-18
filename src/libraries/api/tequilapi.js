import axios from 'axios'

const idPath = '/identities'
const propPath = '/proposals'
const conPath = '/connection'
const healthCheckPath = '/healthcheck'
const stopPath = '/stop'

const DEFAULT_TIMEOUT = 5000

export let tequilapi = Constructor()

export default function Constructor (teqAddr = 'http://127.0.0.1:4050', defaultTimeout = DEFAULT_TIMEOUT) {
  const axioInstance = axios.create({
    baseURL: teqAddr,
    defaultTimeout,
    headers: {
      'Cache-Control': 'no-cache, no-store'
    }
  })
  return TequilapiFactory(axioInstance)
}

export function TequilapiFactory (axioInstance) {
  const axioAdapter = adapterFactory(axioInstance)

  return {
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
      connect: async ({consumerId, providerId}, timeout) => {
        return axioAdapter.put(conPath, {
          consumerId: consumerId,
          providerId: providerId
        }, null, timeout ? {timeout} : undefined)
      },
      disconnect: async () => axioAdapter.delete(conPath),
      status: async () => axioAdapter.get(conPath),
      ip: async (timeout = null) => {
        const res = await axioAdapter.get(conPath + '/ip', timeout ? {timeout} : undefined)
        return res.ip
      },
      statistics: async () => axioAdapter.get(conPath + '/statistics')
    },
    healthCheck: async (timeout = null) => {
      return axioAdapter.get(healthCheckPath, timeout ? {timeout} : undefined)
    },
    stop: async () => axioAdapter.post(stopPath)
  }
}

function adapterFactory (teqAxio) {
  return {
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
}
