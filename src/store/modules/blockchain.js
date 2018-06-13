import axios from "axios"

const state = {
  url: "https://nylira.net",
  status: {
    listen_addr: "",
    sync_info: {
      latest_block_height: 0,
      latest_block_hash: ""
    },
    node_info: {
      version: null,
      network: null,
      moniker: null
    }
  },
  fullNodes: [],
  validators: [],
  consensusState: {}
}

const actions = {
  async getConsensusState({ state, commit }) {
    let json = await axios.get(`${state.url}/consensus_state`)
    commit("setConsensusState", json.data.result.round_state)
  },
  async getStatus({ state, commit }) {
    let json = await axios.get(`${state.url}/status`)
    commit("setStatus", json.data.result)
  },
  async getNodes({ state, commit }) {
    let json = await axios.get(`${state.url}/net_info`)
    let peers = json.data.result.peers
    commit("setFullNodes", peers)
    return Promise.resolve()
  },
  async getValidators({ state, commit }) {
    let json = await axios.get(`${state.url}/validators`)
    if (json.data.result && json.data.result.validators) {
      commit("setValidators", json.data.result.validators)
      return Promise.resolve()
    } else {
      console.log("no validators found")
    }
  }
}

const mutations = {
  setUrl(state, value) {
    state.url = value
  },
  setConsensusState(state, value) {
    state.consensusState = value
  },
  setStatus(state, value) {
    state.status = value
  },
  setValidators(state, value) {
    state.validators = value
  },
  setFullNodes(state, value) {
    let nodes = value
    nodes.push(state.status)
    state.fullNodes = nodes
  },
  setValidator(state, { validator, key }) {
    state.validators[key] = validator
  }
}

export default {
  state,
  actions,
  mutations
}
