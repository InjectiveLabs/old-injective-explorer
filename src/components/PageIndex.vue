<template lang="pug">
tm-page(title='Blockchain')
  tm-part(title='Blockchain')
    tm-list-item(dt='Network' :dd='bc.status.node_info.network')
    tm-list-item(dt='Tendermint Version' :dd='bc.status.node_info.version')
    tm-list-item(dt='Full Nodes' :dd='nodes.length')
    tm-list-item(dt='Validators' :dd='validatorsActive')
    tm-list-item(dt='Prevote State' :dd='votingPower' v-if="blocks[0].header.height < 2")

  tm-part(title='Current Block' v-if="blocks.length")
    tm-list-item(dt='Block Height' :dd='num.prettyInt(blocks[0].header.height)'
      :to="{ name: 'block', params: { block: blocks[0].header.height }}")
    tm-list-item(dt='Block Time' :dd='readableDate(blocks[0].header.time)')
    tm-list-item(dt='Last Block Hash' :dd='blocks[0].header.last_commit_hash')

  tm-part(title='Connected To')
    tm-list-item(dt='Node URL')
      div(slot="dd")
        tm-field#node-input(
          type="text"
          v-model="bc.rpc")
    tm-list-item(dt='Node Moniker' :dd='bc.status.node_info.moniker')
</template>

<script>
import moment from "moment"
import num from "../scripts/num"
import { mapGetters } from "vuex"
import votingValidators from "scripts/votingValidators"
import { TmListItem, TmPage, TmPart, TmField } from "@tendermint/ui"

export default {
  name: "page-index",
  components: {
    TmListItem,
    TmPage,
    TmPart,
    TmField
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
