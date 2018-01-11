import axios from 'axios'

const teqAddr = 'http://localhost:4050'
const teqAxio = axios.create({ baseURL: teqAddr })

function healthcheck () {
  return teqAxio.get('/healthcheck')
}

function getIdentities () {
  return teqAxio.get('/identities')
}

function createIdentity (password) {
  return teqAxio.put('/identities', { password: password })
}

export default {
  healthcheck,
  getIdentities,
  createIdentity
}
