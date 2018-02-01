import type from '../types'

const state = {
  error: null,
  list: []
}

const mutations = {
  [type.PROPOSAL_LIST_SUCCESS] (state, proposals) {
    state.list = proposals
  },
  [type.REQUEST_FAIL] (state, err) {
    state.error = err
  }
}

function factory (tequilapi) {
  const actions = {
    async [type.PROPOSAL_LIST] ({commit}) {
      try {
        const proposalRes = await tequilapi.proposal.list()
        commit(type.PROPOSAL_LIST_SUCCESS, proposalRes.proposals)
        return proposalRes.proposals
      } catch (err) {
        commit(type.REQUEST_FAIL, err)
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
