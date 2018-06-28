<template lang="pug">
menu.app-menu
  .app-menu-main
    tm-list-item(to="/" exact @click.native="close" title="Blockchain")
    tm-list-item(to="/nodes" exact @click.native="close" :title="`Full Nodes (${nodes.length})`")
    tm-list-item(to="/validators" @click.native="close" :title="`Validators (${validatorCount})`" v-bind:class="{ 'active': isValidatorPage }")
    tm-list-item(to="/search" exact @click.native="close" title="Search")

  tm-part(title='Learn More')

    tm-list-item(type="anchor" href="https://cosmos.network/validators/tutorial" @click.native="close" title="Join the testnet" subtitle="run a full node" target="_blank")
    tm-list-item(type="anchor" href="https://faucetcosmos.network" @click.native="close" title="Get testnet tokens" subtitle="100% free" target="_blank")
    tm-list-item(type="anchor" href="https://riot.im/app/#/room/#cosmos_validators:matrix.org" @click.native="close" title="Join validator chat" subtitle="#cosmos-validators" target="_blank")
    tm-list-item(type="anchor" href="http://validators.resilient.zone/gaia-6002" @click.native="close" title="resilient.zone" subtitle="more validator stats" target="_blank")
    tm-list-item(type="anchor" href="https://cosmos.network" @click.native="close" title="cosmos.network" subtitle="official website" target="_blank")
</template>

<script>
import { mapGetters } from "vuex"
import noScroll from "no-scroll"
import votingValidators from "scripts/votingValidators"
import { TmListItem, TmPart } from "@tendermint/ui"
export default {
  name: "app-menu",
  components: {
    TmListItem,
    TmPart
  },
  computed: {
    ...mapGetters(["proposals", "nodes", "validators"]),
    proposalAlerts() {
      return this.proposals.filter(p => p.flags.read === false).length
    },
    isValidatorPage() {
      return this.$route.params.validator
    },
    validatorCount() {
      return `${votingValidators(this.validators).length}/${
        this.validators.length
      }`
    }
  },
  methods: {
    close() {
      this.$store.commit("setActiveMenu", "")
      noScroll.off()
    }
  }
}
</script>

<style lang="stylus">
@require '../styles/variables.styl'

.app-menu
  background var(--app-fg)
  z-index z(appMenu)
  user-select none
  display flex
  flex-flow column nowrap

  .app-menu-main
    flex 1
    position relative // for perfect-scrollbar

    .tm-li
      border-bottom 1px solid var(--bc-dim)
  .tm-part-main
    padding 0
@media screen and (max-width:1023px)
  .app-menu
    position fixed
    top 3rem
    left 0
    bottom 0
    width 100vw
    background var(--app-bg)
    user-select none

@media screen and (min-width: 1024px)
  .app-menu
    flex 1

</style>
