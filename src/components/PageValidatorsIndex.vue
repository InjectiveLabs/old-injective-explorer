<template lang="pug">
tm-page(title='Validators')
  tm-tab-bar
    router-link(to="/validators" exact) Voting Validators ({{ votingValidators.length }})
    router-link(to="/validators/revoked" exact) Revoked Validators ({{ revokedValidators.length }})
  tm-list-item(
    v-if="orderedValidators.length > 0"
    v-for="v in orderedValidators"
    :image="v.avatarUrl"
    :key="v.owner"
    :title="validatorTitle(v)"
    :subtitle="votingPower(v)"
    :to="`/validators/${v.owner}`")
  tm-list-item(v-else title="validators are loading...")
</template>

<script>
import { mapGetters } from "vuex"
import orderedValidators from "scripts/orderedValidators"
import validatorTitle from "scripts/validatorTitle"
import votingPower from "scripts/votingPower"
import votingValidators from "scripts/votingValidators"
import { TmListItem, TmPage, TmTabBar } from "@tendermint/ui"
export default {
  name: "page-validators",
  components: {
    TmListItem,
    TmPage,
    TmTabBar
  },
  computed: {
    ...mapGetters(["validators"]),
    votingValidators() {
      if (this.validators && this.validators.length > 1) {
        return this.validators.filter(v => !v.revoked)
      } else {
        return []
      }
    },
    revokedValidators() {
      return this.validators.filter(v => v.revoked)
    },
    orderedValidators() {
      return orderedValidators(votingValidators(this.validators))
    }
  },
  data: () => ({
    validatorTitle: validatorTitle,
    votingPower: votingPower
  })
}
</script>
