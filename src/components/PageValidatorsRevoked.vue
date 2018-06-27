<template lang="pug">
.validators
  tm-list-item(
    v-if="orderedValidators.length > 0"
    v-for="v in orderedValidators"
    :image="v.avatarUrl"
    :key="v.owner"
    :title="validatorTitle(v)"
    subtitle=""
    :subtitle="`${votingPower(v)} [REVOKED]`"
    :to="`/validators/${v.owner}`")
  list-item(v-else title="validators are loading...")
</template>

<script>
import { mapGetters } from "vuex"
import orderedValidators from "scripts/orderedValidators"
import validatorTitle from "scripts/validatorTitle"
import votingPower from "scripts/votingPower"
import revokedValidators from "scripts/revokedValidators"
import { TmListItem } from "@tendermint/ui"
export default {
  name: "page-validators",
  components: {
    TmListItem
  },
  computed: {
    ...mapGetters(["validators"]),
    orderedValidators() {
      return orderedValidators(revokedValidators(this.validators))
    }
  },
  data: () => ({
    validatorTitle: validatorTitle,
    votingPower: votingPower
  })
}
</script>
