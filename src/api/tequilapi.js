import axios from 'axios'

const teqAddr = 'http://localhost:4050'
const teqAxio = axios.create({ baseURL: teqAddr })

async function healthcheck () {
  try {
    const res = await teqAxio.get('/healthcheck')
    return res
  } catch (err) {
    console.dir(err)
  }
}

function getIdentities () {
  return teqAxio.get('/identities')
}

function createIdentity (password) {
  return teqAxio.put('/identites', { password: password })
}

export default {
  healthcheck,
  getIdentities,
  createIdentity
}
