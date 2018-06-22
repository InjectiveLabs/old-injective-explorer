<template lang="pug">
page(title='Validators')
  tab-bar
    router-link(to="/validators" exact) Voting Validators ({{ votingValidators.length }})
    router-link(to="/validators/revoked" exact) Revoked Validators ({{ revokedValidators.length }})
  router-view
</template>

<script>
import { mapGetters } from "vuex"
import Page from "./NiPage"
import TabBar from "./NiTabBar"
import ToolBar from "./NiToolBar"
export default {
  name: "page-validators",
  components: {
    Page,
    TabBar,
    ToolBar
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
