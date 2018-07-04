<template>
  <div class="home">
    <TvList msg="TvList" v-on:power="power" v-on:select="select"/>
  </div>
</template>

<script>
// @ is an alias to /src
import TvList from '@/components/TvList.vue'
import REST from '@/rest.js'

export default {
  name: 'home',
  components: {
    TvList
  },

  methods: {
    async power (tvId) {
      console.log('power', tvId)
      try {
        const response = await REST.post('power/' + tvId)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    },

    select (tvId) {
      console.log('select', tvId)
    }
  }
}
</script>
