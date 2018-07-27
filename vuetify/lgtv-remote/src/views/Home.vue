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

export default {
  name: 'home',
  components: {
    TvList
  },

  methods: {
    select (tvId) {
      console.log('select', tvId)
      this.$router.push('tv/' + tvId)
    }
  }
}
</script>
