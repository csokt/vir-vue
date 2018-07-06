<template>
  <div>
    <h1>{{ msg }}</h1>
    <ol>
      <li v-for="play in playlist" v-bind:key="play.id"  @click="$emit('select', 'playlist', play.id)">
        {{ play.label }}
      </li>
    </ol>
  </div>
</template>

<script>
import API from '@/rest.js'

export default {
  name: 'playlist',
  props: {
    msg: String
  },

  data () {
    return {
      playlist: []
    }
  },

  methods: {
    async getPlayList () {
      const response = await API.get('tir/config/playlists')
      if (response.ok) {
        this.playlist = response.data
      } else {
        this.playlist = []
        console.log(response.problem)
      }
    }
  },

  created () {
    this.getPlayList()
  }

}
</script>
