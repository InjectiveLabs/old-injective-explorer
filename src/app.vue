<template lang="pug">
#app
  app-header
  #app-content
    #app-main: router-view
    app-footer
</template>

<script>
import AppFooter from "./components/AppFooter"
import AppHeader from "./components/AppHeader"
import store from "./store/index"
import requestInterval from "request-interval"
export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter
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
