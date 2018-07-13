<template lang="pug">
#app
  tm-cookie-consent
  tm-modal-error(
    v-if="nodes.length === 0"
    title="Cosmos Explorer is offline."
    body="The current testnet is offline. The next testnet will be launching soon. Follow us on Twitter to get notified when the next testnet starts."
    btn-icon="forum" btn-value="Cosmos on Twitter" btn-url="https://twitter.com/cosmos")
  app-header
  #app-content
    router-view
    app-footer
</template>

<script>
import requestInterval from "request-interval"
import { mapGetters } from "vuex"
import { TmCookieConsent, TmModalError } from "@tendermint/ui"
import AppFooter from "./components/AppFooter"
import AppHeader from "./components/AppHeader"
import store from "./store/index"
export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter,
    TmCookieConsent,
    TmModalError
  },
  computed: {
    ...mapGetters(["nodes"])
  },
  mounted() {
    this.$store.dispatch("subNewBlock")
    this.$store.dispatch("subRoundStep")
    requestInterval(1000, () => this.$store.dispatch("getConsensusState"))
    this.$store.dispatch("getStatus")
    this.$store.dispatch("getNodes")
    this.$store.dispatch("getValidators")
  },
  store
}
</script>

<style lang="stylus" src="./styles/app.styl"></style>
