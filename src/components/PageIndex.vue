<template lang="pug">
page(title='Blockchain')
  part(title='Blockchain')
    list-item(dt='Network' :dd='bc.status.node_info.network')
    list-item(dt='Tendermint Version' :dd='bc.status.node_info.version')
    list-item(dt='Full Nodes' :dd='nodes.length')
    list-item(dt='Validators' :dd='validatorsActive')
    list-item(dt='Prevote State' :dd='votingPower')

  part(title='Current Block' v-if="blocks")
    list-item(dt='Block Height' :dd='num.prettyInt(blocks[0].header.height)'
      :to="{ name: 'block', params: { block: blocks[0].header.height }}")
    list-item(dt='Block Time' :dd='readableDate(blocks[0].header.time)')
    list-item(dt='Last Block Hash' :dd='blocks[0].header.last_commit_hash')

  part(title='Connected To')
    list-item(dt='Node URL')
      div(slot="dd"): input#node-input(v-model="bc.rpc")
    list-item(dt='Node Moniker' :dd='bc.status.node_info.moniker')
</template>

<script>
import moment from "moment"
import num from "../scripts/num"
import { mapGetters } from "vuex"
import votingValidators from "scripts/votingValidators"
import ListItem from "./NiListItem"
import Page from "./NiPage"
import Part from "./NiPart"
export default {
  name: "page-index",
  components: {
    ListItem,
    Page,
    Part
  },
  computed: {
    ...mapGetters([
      "bc",
      "config",
      "nodes",
      "validators",
      "consensusState",
      "blocks"
    ]),
    validatorsActive() {
      if (this.validators && this.validators.length > 0) {
        return this.validatorCount
      }
      if (this.consensusState && this.consensusState.height_vote_set) {
        return "STALLED - need 67% voting power"
      }
      return "Loading..."
    },
    validatorCount() {
      return `${votingValidators(this.validators).length} voting / ${
        this.validators.length
      } total`
    },
    votingPower() {
      if (this.consensusState && this.consensusState.height_vote_set) {
        let prevotes = this.consensusState.height_vote_set[0].prevotes_bit_array
        let split = prevotes.split(" ")
        let onlineSteak = split[1].split("/")[0]
        let totalSteak = split[1].split("/")[1]
        let minimumSteak = Math.round(totalSteak * 0.6667)
        if (onlineSteak >= minimumSteak) {
          return `${split[3] * 100}% prevoted`
        } else {
          return `${split[3] *
            100}% prevoted (${onlineSteak}steak, need ${minimumSteak}steak)`
        }
      }
      return "Loading..."
    }
  },
  data: () => ({
    moment: moment,
    num: num
  }),
  methods: {
    readableDate(ms) {
      return moment(ms).format("YYYY-MM-DD h:mm:ss A")
    },
    toggleBlockchainSelect() {
      this.$store.commit(
        "SET_CONFIG_BLOCKCHAIN_SELECT",
        !this.config.blockchainSelect
      )
    }
  }
}
</script>

<style lang='stylus'>
@require '~variables'

input#node-input
  min-width 20rem
  height 2rem
  padding 0 0.5rem
  background transparent
  df()
  #f00
</style
