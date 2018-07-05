<template>
  <div class="home">
    <TvList msg="TvList" v-on:select="select"/>
  </div>
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
