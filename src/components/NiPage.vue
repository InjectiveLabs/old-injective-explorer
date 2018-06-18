<template lang="pug">
.ni-page
  tm-page-header
    div(slot='title') {{ title }}
  main.ni-page-main: slot
  tm-page-footer
</template>

<script>
import {TmPageHeader, TmPageFooter} from "@tendermint/ui"
export default {
  name: "page-search",
  props: ["title"],
  components: {
    TmPageHeader,
    TmPageFooter
  }
}
</script>
