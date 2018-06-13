<template lang="pug">
page(:title="`Validator: ${validator.address}`")
  tool-bar
    router-link(to="/validators" exact): i.material-icons arrow_back
    anchor-copy(:value="validator.address" icon="content_copy")

  part(title='ID')
    list-item(dt="Voting Power" :dd="validator.voting_power")
    list-item(dt="Accum" :dd="validator.accum")

  part(title='Pub Key')
    list-item(dt="Value" :dd="validator.pub_key.value")
</template>

<script>
import { mapGetters } from "vuex"
import ListItem from "./NiListItem"
import ToolBar from "./NiToolBar"
import Page from "./NiPage"
import Part from "./NiPart"
import AnchorCopy from "./AnchorCopy"
export default {
  name: "page-validator",
  components: {
    AnchorCopy,
    ListItem,
    Page,
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
