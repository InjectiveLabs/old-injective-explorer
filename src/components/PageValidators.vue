<template lang="pug">
page(title='Validators')
  tab-bar
    router-link(to="/validators" exact) Total: {{ online }}
    a(@click.prevent='toggleFilter' href="#"): i.material-icons(:class="{'mdi-rotate-180': asc}") filter_list
  // tool-bar
    a(@click='toggleSearch'): i.material-icons search
    a(@click='toggleSearch'): i.material-icons search
  list-item(
    v-for="v in validators"
    :key="v.address"
    :title="v.address"
    :subtitle="`${v.voting_power}steak (${v.accum} accum)`"
    icon='storage'
    :to="`/validators/${v.address}`")
</template>

<script>
import { mapGetters } from "vuex"
import ListItem from "./NiListItem"
import Page from "./NiPage"
import TabBar from "./NiTabBar"
import ToolBar from "./NiToolBar"
export default {
  name: "page-validators",
  components: {
    ListItem,
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
    online() {
      return this.validators.length
    }
  },
  methods: {
    toggleFilter() {
      this.asc = !this.asc
      // this.$store.commit('notify', { title: 'Filtering...', body: 'TODO' })
    },
    toggleSearch() {
      // this.$store.commit('notify', { title: 'Searching...', body: 'TODO' })
    },
    urlsafeIp(ip) {
      return ip.split(".").join("-")
    },
    getIp(validator) {
      return validator.node_info.listen_addr.split(":")[0]
    },
    getTitle(v) {
      return (
        v.node_info.moniker +
        (v.validator ? " — " + v.validator.voting_power : " — 0")
      )
    }
  }
}
</script>
