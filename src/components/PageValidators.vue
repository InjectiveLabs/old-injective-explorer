<template lang="pug">
tm-page(title='Validators')
  tm-tab-bar
    router-link(to="/validators" exact) Voting Validators ({{ votingValidators.length }})
    router-link(to="/validators/revoked" exact) Revoked Validators ({{ revokedValidators.length }})
  router-view
</template>

<script>
import { mapGetters } from "vuex"
import { TmPage, TmTabBar } from "@tendermint/ui"
export default {
  name: "page-validators",
  components: {
    TmPage,
    TmTabBar
  },
  data() {
    return {
      asc: false
    }
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
    }
  },
  methods: {
    toggleFilter() {
      this.asc = !this.asc
      // this.$store.commit('notify', { title: 'Filtering...', body: 'TODO' })
    },
    toggleSearch() {
      // this.$store.commit('notify', { title: 'Searching...', body: 'TODO' })
    }
  }
}
</script>
