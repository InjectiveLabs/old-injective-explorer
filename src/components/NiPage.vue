<template lang="pug">
.ni-page
  tm-page-header
    div(slot='title') {{ title }}
  main.ni-page-main: slot
  page-footer
</template>

<script>
import {TmPageHeader} from "@tendermint/ui"
import PageFooter from "./NiPageFooter"
export default {
  name: "page-search",
  props: ["title"],
  components: {
    TmPageHeader,
    PageFooter
  }
}
</script>
