<template lang="pug">
.validator
  tool-bar
    router-link(to="/validators" exact): i.material-icons arrow_back
    anchor-copy(:value="validator.address" icon="content_copy")

  part(title='!!! CRITICAL ALERT !!!' v-if="validator.revoked")
    list-item(title="This validator is revoked!" subtitle="Are you the owner? Go fix it!" type="anchor" href="https://cosmos.network/validators/tutorial/")

  part(title='Validator Description')
    list-item(dt="Moniker" :dd="validator.description.moniker")
    list-item(dt="Identity" :dd="validator.description.identity")
    list-item(dt="Website" :dd="validator.description.website")
    list-item(dt="Details" :dd="validator.description.details")

  part(title='Validator Keys')
    list-item(dt="Owner" :dd="validator.owner")
    list-item(dt="Pub Key" :dd="validator.pub_key")

  part(title='Validator Stake' v-if="!validator.revoked")
    list-item(dt="Voting Power" :dd="validator.pool_shares.amount")
    list-item(dt="Bond Height" :dd="`Block ${validator.bond_height}`")
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
          v => this.$route.params.validator === v.owner
        )
      } else {
        return this.tmpValidator
      }
    }
  },
  data: () => ({
    tmpValidator: {
      owner: "Loading...",
      pubkey: "Loading...",
      revoked: false,
      delegator_shares: "Loading...",
      pool_shares: {
        status: "Loading...",
        amount: "Loading..."
      },
      description: {
        moniker: "Loading...",
        identity: "Loading...",
        website: "Loading...",
        details: "Loading..."
      }
    }
  }),
  methods: {
    validatorTitle(validator) {
      let title
      if (validator.description.moniker) {
        title = validator.description.moniker
      } else {
        title = "Anonymous"
      }
      let shortOwner = validator.owner.split(1)[1]
      shortOwner = shortOwner.slice(0, 8)
      title += ` - (${shortOwner})`
      return title
    }
  }
}
</script>
