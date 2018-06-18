<template lang="pug">
page(title='Blockchain')
  part(title='Blockchain')
    tm-list-item(dt='Network' :dd='bc.status.node_info.network')
    tm-list-item(dt='Tendermint Version' :dd='bc.status.node_info.version')
    tm-list-item(dt='Full Nodes' :dd='fullNodes.length')
    tm-list-item(dt='Validators' :dd='validatorsOnline')
    tm-list-item(dt='Prevote State' :dd='votingPower')

  part(title='Current Block')
    tm-list-item(dt='Block Height' :dd='num.prettyInt(bc.status.sync_info.latest_block_height)'
      :to="{ name: 'block', params: { block: bc.status.sync_info.latest_block_height} }")
    tm-list-item(dt='Latest Block Time' :dd='readableDate(bc.status.sync_info.latest_block_time)')
    tm-list-item(dt='Latest Block Hash' :dd='bc.status.sync_info.latest_block_hash')

  part(title='Connected Node')
    tm-list-item(dt='Node Address')
      div(slot="dd"): input#node-input(v-model="bc.url")
    tm-list-item(dt='Node Moniker' :dd='bc.status.node_info.moniker')
</template>

<script>
import moment from "moment"
import num from "../scripts/num"
import { mapGetters } from "vuex"
import {TmListItem} from "@tendermint/ui"
import Page from "./NiPage"
import Part from "./NiPart"
export default {
  name: "page-index",
  components: {
    TmListItem,
    Page,
    Part
  },
  computed: {
    ...mapGetters([
      "bc",
      "config",
      "fullNodes",
      "validators",
      "consensusState"
    ]),
    validatorsOnline() {
      if (this.validators && this.validators.length > 0) {
        return this.validators.length
      }
      if (this.consensusState && this.consensusState.height_vote_set) {
        return "STALLED - need 67% voting power"
      }
      return "Loading..."
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
