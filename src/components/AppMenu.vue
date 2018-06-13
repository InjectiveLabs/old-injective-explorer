<template lang="pug">
menu.app-menu
  part(title='Network Explorer')

    list-item(to="/" exact @click.native="close" title="Blockchain")
    list-item(to="/nodes" exact @click.native="close" :title="`Full Nodes (${fullNodes.length})`" v-bind:class="{ 'active': isValidatorPage }")
    list-item(to="/validators" exact @click.native="close" :title="`Validators (${validators.length})`" v-bind:class="{ 'active': isValidatorPage }")
    list-item(to="/search" exact @click.native="close" title="Search")

  part(title='Learn More')

    list-item(type="anchor" href="https://riot.im/app/#/room/#cosmos_validators:matrix.org" @click.native="close" title="#cosmos_validators" subtitle="validator chat" target="_blank")
    list-item(type="anchor" href="http://validators.resilient.zone/gaia-5/" @click.native="close" title="resilient.zone" subtitle="validator statistics" target="_blank")
    list-item(type="anchor" href="https://cosmos.network" @click.native="close" title="cosmos.network" subtitle="official website" target="_blank")
</template>

<script>
import { mapGetters } from "vuex"
import noScroll from "no-scroll"
import ListItem from "./NiListItem"
import Part from "./NiPart"
export default {
  name: "app-menu",
  components: {
    ListItem,
    Part
  },
  computed: {
    ...mapGetters(["proposals", "fullNodes", "validators"]),
    proposalAlerts() {
      return this.proposals.filter(p => p.flags.read === false).length
    },
    isValidatorPage() {
      return this.$route.params.validator
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
  background app-bg-alpha
  z-index 99
  user-select none

@media screen and (max-width:1023px)
  .app-menu
    height 100vh
    position fixed
    top 3rem
    left 0
    bottom 0
    width 100vw

    background bg-menu
    user-select none

@media screen and (min-width: 1024px)
  .app-menu
    nav > a
      height 3rem
      border-bottom 1px solid bc
</style>
