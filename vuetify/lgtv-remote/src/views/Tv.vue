<template>
  <v-container fluid fill-height grid-list-lg>
    <v-layout  justify-center wrap>
      <Remote v-bind:tv="tv" v-on:select="call"/>
      <ViewList v-if="tv.state == 'connect'" v-on:select="call"/>
      <PlayList v-if="tv.state == 'connect'" v-on:select="call"/>
    </v-layout>
  </v-container>
</template>

<script>
import API from '@/rest.js'
import { EventBus } from '@/util.js'
import Remote from '@/components/Remote.vue'
import ViewList from '@/components/ViewList.vue'
import PlayList from '@/components/PlayList.vue'

export default {
  name: 'tv',
  components: {
    Remote,
    ViewList,
    PlayList
  },

  data () {
    return {
      tv: {}
    }
  },

  // https://github.com/kelin2025/vue-timers
  timers: {
    getTv: { time: 1000, autostart: true, repeat: true, immediate: true }
  },

  methods: {
    async getTv () {
      const response = await API.get('tv/' + this.$route.params.id)
      if (response.ok) {
        this.tv = response.data
      } else {
        this.tv = {}
        EventBus.$emit('inform', {type: 'alert', variation: 'error', message: 'TV betöltési hiba!'})
        console.log(response.problem)
      }
    },

    async call (method, arg = '') {
      let url = method + '/' + this.$route.params.id
      if (arg) url = url + '/' + arg
      EventBus.$emit('inform', {type: 'alert', variation: 'info', message: url})
      const response = await API.post('tv/' + url)
      console.log(response.data)
    }
  }
}
</script>
