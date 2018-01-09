import axios from 'axios'

async function healthcheck () {
  const res = await axios.get('127.0.0.1:4050/healthcheck')
  return res.data
}

export default {
  healthcheck
}
