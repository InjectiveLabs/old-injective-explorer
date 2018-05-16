import axios from 'axios'

const state = {
  url: 'http://138.68.77.24:46657',
  status: {
    listen_addr: '',
    sync_info: {
      latest_block_height: 0,
      latest_block_hash: ''
    },
    node_info: {
      version: null,
      network: null,
      moniker: null
    }
  },
  validators: []
}

const mutations = {
  setUrl (state, value) {
    state.url = value
  },
  async getStatus (state) {
    let json = await axios.get(`${state.url}/status`)
    // console.log('blockchain', json.data)
    state.status = json.data.result
  },
  async getValidators (state) {
    let json = await axios.get(`${state.url}/net_info`)
    // console.log('validators', json.data.result.peers)
    state.validators = json.data.result.peers
  }
}

export default {
  state,
  mutations
}
