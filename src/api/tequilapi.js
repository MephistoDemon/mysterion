import axios from 'axios'

export default function (teqAddr = 'http://localhost:4050') {
  const teqAxio = axios.create({ baseURL: teqAddr })
  return {
    __axio: teqAxio,
    async get (path) {
      try {
        const res = await teqAxio.get(path)
        return res.data
      } catch (err) {
        throw (err)
      }
    },
    async post (path, body) {
      try {
        const prom = teqAxio.post(path, body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }})
        const res = await prom
        return res.data
      } catch (err) {
        throw (err)
      }
    }
  }
}
