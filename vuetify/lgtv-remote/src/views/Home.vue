<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <TvList v-on:select="select"/>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import TvList from '@/components/TvList.vue'
import Store from '@/store'

export default {
  name: 'home',
  components: {
    TvList
  },

  data () {
    return {
      store: Store
    }
  },

  created () {
    this.store.pageTitle = 'TV vezérlés'
  },

  methods: {
    select (tv) {
      console.log('select', tv.id)
      this.store.pageTitle = tv.label
      this.$router.push('tv/' + tv.id)
    }
  }
}
</script>
