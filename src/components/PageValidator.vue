<template lang="pug">
tm-page(:title="`Validator: ${validator.address}`")
  tool-bar
    router-link(to="/validators" exact): i.material-icons arrow_back
    anchor-copy(:value="validator.address" icon="content_copy")

  part(title='ID')
    ui-list-item(dt="Voting Power" :dd="validator.voting_power")
    ui-list-item(dt="Accum" :dd="validator.accum")

  part(title='Pub Key')
    ui-list-item(dt="Value" :dd="validator.pub_key.value")
</template>

<script>
import { mapGetters } from "vuex"
import {TmListItem, TmPage} from "@tendermint/ui"
import ToolBar from "./NiToolBar"
import Part from "./NiPart"
import AnchorCopy from "./AnchorCopy"
export default {
  name: "page-validator",
  components: {
    AnchorCopy,
    TmListItem,
    TmPage,
    Part,
    ToolBar
  },
  computed: {
    ...mapGetters(["validators"]),
    validator() {
      if (this.validators && this.validators.length > 0) {
        return this.validators.find(
          v => this.$route.params.validator === v.address
        )
      } else {
        return this.tmpValidator
      }
    }
  },
  data: () => ({
    tmpValidator: {
      address: "Loading...",
      voting_power: "0",
      accum: "0"
    }
  })
}
</script>
