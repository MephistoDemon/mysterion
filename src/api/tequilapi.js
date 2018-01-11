import axios from 'axios'

const teqAddr = 'http://localhost:4050'
const teqAxio = axios.create({ baseURL: teqAddr })

function healthcheck () {
  return axios.get('/healthcheck')
}
function getIdentities () {
  return teqAddr.get('/identities')
}
function createIdentity (password) {
  return teqAxio.put('/identites', { password: password })
}
export default {
  healthcheck,
  getIdentities,
  createIdentity
}
