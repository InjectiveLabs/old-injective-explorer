<template lang="pug">
tm-page(title='Full Nodes')
  tm-tab-bar
    router-link(to="/nodes" exact) Connected Nodes ({{ online }})
    a(@click.prevent='toggleFilter' href="#"): i.material-icons(:class="{'mdi-rotate-180': asc}") filter_list
  // tm-tool-bar
    a(@click='toggleSearch'): i.material-icons search
    a(@click='toggleSearch'): i.material-icons search
  tm-list-item(
    v-for="i in orderedFullNodes"
    :key="i.node_info.listen_addr"
    :title="i.node_info.moniker"
    :subtitle="getIp(i)"
    icon='storage'
    :to="`/nodes/${urlsafeIp(getIp(i))}`")
</template>

<script>
import { mapGetters } from "vuex"
import { orderBy } from "lodash"
import { TmListItem, TmPage, TmTabBar, TmToolBar } from "@tendermint/ui"
export default {
  name: "page-nodes",
  components: {
    TmListItem,
    TmPage,
    TmTabBar,
    TmToolBar
  },
  data() {
    return {
      asc: true
    }
  },
  computed: {
    ...mapGetters(["nodes"]),
    orderedFullNodes() {
      if (this.nodes) {
        return orderBy(
          this.nodes,
          "node_info.moniker",
          this.asc ? "asc" : "desc"
        )
      } else {
        return []
      }
    },
    online() {
      return this.nodes.length
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
    getIp(fullNode) {
      return fullNode.node_info.listen_addr.split(":")[0]
    }
  }
}
</script>
