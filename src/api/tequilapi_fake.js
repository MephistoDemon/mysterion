function healthcheck () {
  return new Promise((resolve) => {
    resolve({ uptime: '000' })
  })
}

function getProposals () {
  return new Promise((resolve) => {
    resolve({ proposals: [{ id: 1, providerId: 'ceedbeef' }] })
  })
}

function getIdentities () {
  return new Promise((resolve) => {
    resolve({ identities: [{ id: 'ceedbeef' }] })
  })
}

export default {
  healthcheck,
  getIdentities,
  getProposals
}
