import axios from "axios"
import { RpcClient } from "tendermint"

const state = {
  rpc: process.env.VUE_APP_RPC_URL,
  //lcd: "https://gaia-seeds.interblock.io:1317",
  status: {
    listen_addr: "",
    sync_info: {
      latest_block_height: 0,
      latest_block_hash: ""
    },
    node_info: {
      version: "0.32.3",
      network: "testnet",
      moniker: "injective"
    }
  },
  nodes: [],
  // [{
  //   "node_info": {
  //     "protocol_version": {
  //       "p2p": "7",
  //       "block": "10",
  //       "app": "0"
  //     },
  //     "id": "b2298a0f940a9f869ab8ba72077422586699132f",
  //     "listen_addr": "tcp://0.0.0.0:26656",
  //     "network": "testnet",
  //     "version": "0.32.3",
  //     "channels": "4020212223303800",
  //     "moniker": "injective",
  //     "other": {
  //       "tx_index": "on",
  //       "rpc_address": "tcp://127.0.0.1:26657"
  //     }
  //   },
  //   "sync_info": {
  //     "latest_block_hash": "700FE0856586C8A7249FFCD065840A4253A7C19B1B9F05DD35DAA75CAFE34CD9",
  //     "latest_app_hash": "30E886C73D6984177D524317F0CE668F0C32F15C0B5EC2B188E3E2E6D4E8690E",
  //     "latest_block_height": "24689",
  //     "latest_block_time": "2019-10-25T01:50:12.389533Z",
  //     "catching_up": false
  //   },
  //   "validator_info": {
  //     "address": "D2A7726E05E13ED5289F869450EE7DD0BAA700CC",
  //     "pub_key": {
  //       "type": "tendermint/PubKeyEd25519",
  //       "value": "sk/BjG9hxq1YxSqb218N5Pk2AcApduu5+g92F7qsqnE="
  //     },
  //     "voting_power": "1000"
  //   }
  // }]
  validators: [],
  //
  // [{
  //   "jsonrpc": "2.0",
  //   "id": "",
  //   "result": {
  //     "block_height": "24774",
  //     "validators": [
  //       {
  //         "address": "D2A7726E05E13ED5289F869450EE7DD0BAA700CC",
  //         "pub_key": {
  //           "type": "tendermint/PubKeyEd25519",
  //           "value": "sk/BjG9hxq1YxSqb218N5Pk2AcApduu5+g92F7qsqnE="
  //         },
  //         "voting_power": "1000",
  //         "proposer_priority": "0"
  //       }
  //     ]
  //   }
  // }]
  consensusState: {},
  dumpConsensusState: {},
  blocks: [],
  roundStep: ""
}

const client = RpcClient(process.env.VUE_APP_RPC_WS_URL)

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
    // let json = await axios.get(`${state.rpc}/status`)
    // let nodes = [json.data.result]
    let json = await axios.get(`${state.rpc}/net_info`)
    let nodes = json.data.result.peers
    commit("setNodes", nodes)
    return Promise.resolve()
  },
  async getValidators({ state, commit, dispatch }) {
    let json = await axios.get(`${state.rpc}/validators`)
    commit("setValidators", json.data.result.validators)
    dispatch("updateValidatorAvatars")
    return Promise.resolve()
  },
  async getLastBlock({ state, commit }) {
    let json = await axios.get(`${state.rpc}/block`)
    commit("addBlock", json.data.result.block)
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
  },
  async updateValidatorAvatars({ state, commit }) {
    state.validators.map(async validator => {
      if (validator.description && validator.description.identity) {
        let urlPrefix =
          "https://keybase.io/_/api/1.0/user/lookup.json?key_suffix="
        let fullUrl = urlPrefix + validator.description.identity
        let json = await axios.get(fullUrl)
        if (json.data.status.name === "OK") {
          let user = json.data.them[0]
          if (user.pictures && user.pictures.primary) {
            commit("setValidatorAvatar", {
              validatorOwner: validator.owner,
              avatarUrl: user.pictures.primary.url
            })
          }
        }
      }
    })
  }
}

const mutations = {
  setUrl(state, value) {
    state.rpc = value //"http://127.0.0.1/26657"
  },
  setStatus(state, value) {
    state.status = value
  },
  setValidators(state, value) {
    if (value) {
      // add some default ugly avatars
      let validators = value.map(v => {
        v.avatarUrl = "http://via.placeholder.com/94/191F24/FFFFFF?text=?"
        return v
      })
      state.validators = validators
    }
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
  setValidatorAvatar(state, { validatorOwner, avatarUrl }) {
    let validator = state.validators.find(v => v.owner === validatorOwner)
    validator.avatarUrl = avatarUrl
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
