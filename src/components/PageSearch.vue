<template lang="pug">
page(title='Search')
  part(title='Search')
    tm-form-struct(:submit="search")
      tm-form-group
        field#search-input(
          type="text"
          placeholder="Search for block"
          required
          v-model="query"
          pattern=".{1,60}"
          title="1 to 60 characters")
      div(slot="footer")
        div
        btn(type="submit" icon="search" value="Go")

  part(title='Sample Queries')
    // tm-list-item(dt='Address' dd='3HNSiAq7wFDaPsYDcUxNSRMD78qVcYKicw' @click.native="fillField('3HNSiAq7wFDaPsYDcUxNSRMD78qVcYKicw')")
    // tm-list-item(dt='Transaction' dd='878797d16182f6ffa5e98cd88576ab973b8d6f9dfe8ff441bd3521a7d8559800' @click.native="fillField('878797d16182f6ffa5e98cd88576ab973b8d6f9dfe8ff441bd3521a7d8559800')")
    tm-list-item(dt='Block #' dd='1337' @click.native="fillField('1337')")
</template>

<script>
import { mapGetters } from 'vuex'
import Btn from '@nylira/vue-button'
import Field from '@nylira/vue-field'
import {TmListItem, TmFormGroup, TmFormStruct} from '@tendermint/ui'
import Page from './NiPage'
import Part from './NiPart'
export default {
  name: 'page-search',
  components: {
    Btn,
    Field,
    TmFormGroup,
    TmFormStruct,
    TmListItem,
    Page,
    Part
  },
  computed: {
    ...mapGetters(['bc'])
  },
  data: () => ({
    query: ''
  }),
  methods: {
    fillField (value) {
      this.query = value
    },
    search () {
      if (parseInt(this.query)) {
        this.$router.push({ name: 'block', params: { block: this.query } })
      } else {
        console.log('Only block # queries are supported right now', this.query)
      }
    }
  }
}
</script>
