const state = {
  error: null,
  list: null
}

const mutations = {
  PROPOSAL_LIST_SUCCESS (state, proposals) {
    state.list = proposals
  },
  REQUEST_FAIL (state, err) {
    state.error = err
  }
}

function factory (tequilapi) {
  const actions = {
    async proposalList ({commit}) {
      try {
        const proposalRes = await tequilapi.proposal.list()
        commit('PROPOSAL_LIST_SUCCESS', proposalRes.proposals)
        return proposalRes.proposals
      } catch (err) {
        commit('REQUEST_FAIL', err)
        throw (err)
      }
    }
  }
  return {
    state,
    mutations,
    actions
  }
}

export default factory
