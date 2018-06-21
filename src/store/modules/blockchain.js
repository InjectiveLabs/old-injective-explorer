import axios from "axios"
import { RpcClient } from "tendermint"

const state = {
  rpc: "https://rpc.nylira.net",
  lcd: "https://lcd.nylira.net",
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
  nodes: [],
  validators: [],
  consensusState: {},
  dumpConsensusState: {},
  blocks: [],
  roundStep: ""
}

const client = RpcClient("wss://nylira.net:443")

const actions = {
  subNewBlock({ commit, dispatch }) {
    client.subscribe({ query: "tm.event = 'NewBlock'" }, event => {
      commit("addBlock", event.block)
      // check for new nodes every 10 blocks
      if (event.block.header.height % 10 === 0) {
        dispatch("getNodes")
        dispatch("getValidators")
      }
    })
  },
  subRoundStep({ commit, dispatch }) {
    let eventName = "NewRoundStep"
    client.subscribe({ query: `tm.event = '${eventName}'` }, event => {
      let stepName = event.step
      let step
      switch (stepName) {
        case "RoundStepPropose":
          step = 0
          dispatch("getDumpConsensusState")
          break
        case "RoundStepPrevote":
          step = 1
          break
        case "RoundStepPrecommit":
          step = 2
          break
        case "RoundStepCommit":
          step = 3
          break
        case "RoundStepNewHeight":
          step = 4
          break
      }
      commit("setRoundStep", step)
    })
  },
  async getStatus({ commit }) {
    let json = await axios.get(`${state.rpc}/status`)
    let status = json.data.result
    commit("setStatus", status)
    return Promise.resolve()
  },
  async getNodes({ state, commit }) {
    let json = await axios.get(`${state.rpc}/net_info`)
    let nodes = json.data.result.peers
    commit("setNodes", nodes)
    return Promise.resolve()
  },
  async getValidators({ state, commit }) {
    let json = await axios.get(`${state.lcd}/stake/validators`)
    commit("setValidators", json.data)
    return Promise.resolve()
  },
  async getConsensusState({ state, commit }) {
    let json = await axios.get(`${state.rpc}/consensus_state`)
    let consensusState = json.data.result.round_state
    commit("setConsensusState", consensusState)
    return Promise.resolve()
  },
  async getDumpConsensusState({ state, commit }) {
    let json = await axios.get(`${state.rpc}/dump_consensus_state`)
    commit("setDumpConsensusState", json.data.result)
    return Promise.resolve()
  }
}

const mutations = {
  setUrl(state, value) {
    state.rpc = value
  },
  setStatus(state, value) {
    state.status = value
  },
  setValidators(state, value) {
    state.validators = value
  },
  setNodes(state, value) {
    let nodes = value
    nodes.push(state.status)
    state.nodes = nodes
  },
  identifyValidator(state, { address, node_info }) {
    let validator = state.validators.find(v => v.address === address)
    validator.node_info = node_info
  },
  setConsensusState(state, value) {
    state.consensusState = value
  },
  setDumpConsensusState(state, value) {
    state.dumpConsensusState = value
  },
  setProposer(state, address) {
    let proposer = state.validators.find(v => v.address === address)
    if (proposer) {
      proposer.isProposer = true
      state.validators.map(v => {
        if (v.address !== address) {
          v.isProposer = false
        }
      })
    }
  },
  addBlock(state, block) {
    state.blocks.unshift(block)
    const maxBlocks = 100
    if (state.blocks.length > maxBlocks) {
      state.blocks = state.blocks.slice(0, maxBlocks)
    }
  },
  setRoundStep(state, step) {
    state.roundStep = step
  }
}

export default {
  state,
  actions,
  mutations
}
