<template lang="pug">
.validators
  list-item(
    v-if="orderedValidators.length > 0"
    v-for="v in orderedValidators"
    :image="v.avatarUrl"
    :key="v.owner"
    :title="validatorTitle(v)"
    subtitle="WARNING: Validator is Revoked"
    :to="`/validators/${v.owner}`")
  list-item(v-else title="validators are loading...")
</template>

<script>
import { mapGetters } from "vuex"
import orderedValidators from "scripts/orderedValidators"
import validatorTitle from "scripts/validatorTitle"
import revokedValidators from "scripts/revokedValidators"
import ListItem from "./NiListItem"
export default {
  name: "page-validators",
  components: {
    ListItem
  },
  computed: {
    ...mapGetters(["validators"]),
    orderedValidators() {
      return orderedValidators(revokedValidators(this.validators))
    }
  },
  data: () => ({
    validatorTitle: validatorTitle
  })
}
</script>
