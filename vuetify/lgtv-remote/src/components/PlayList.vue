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
      try {
        const response = await API.get('tir/config/playlists')
        this.playlist = response.data
      } catch (err) {
        this.playlist = []
        console.log(err)
      }
    }
  },

  created () {
    this.getPlayList()
  }

}
</script>
