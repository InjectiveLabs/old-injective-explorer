<template lang="pug">
#app
  tm-cookie-consent
  app-header
  #app-content
    router-view
    app-footer
</template>

<script>
import requestInterval from "request-interval"
import { TmCookieConsent } from "@tendermint/ui"
import AppFooter from "./components/AppFooter"
import AppHeader from "./components/AppHeader"
import store from "./store/index"
export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter,
    TmCookieConsent
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
