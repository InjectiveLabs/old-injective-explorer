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
  peers: []
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
  async getNodes (state) {
    let json = await axios.get(`${state.url}/net_info`)
    // console.log('peers', json.data.result.peers)
    state.peers = json.data.result.peers
  },
  async getValidators (state) {
    // let validators = await axios.get(`${state.url}/validators`)
    // console.log('validators', validators.data.result.validators)
    Promise.all(
      state.peers.map(async p => {
        console.log(p.node_info.listen_addr)
        try {
          p.status = await axios.get(`http://${p.node_info.listen_addr}/status`)
        } catch (error) {
          console.log(error)
          console.log('not this one')
        }
        return p
      })
    ).then(peers => {
      console.log('peers', peers)
      state.peers = peers
    })
  }
}

export default {
  state,
  mutations
}
