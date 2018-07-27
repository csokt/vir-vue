<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Lejátszási listák</div> </v-card-title>
      <v-list>
        <template v-for="(item, index) in playlist">
        <v-list-tile :key="item.id" avatar @click="$emit('select', 'playlist', item.id)">
          <v-list-tile-content>
            <v-list-tile-title v-html="item.label"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="index + 1 < playlist.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script>
import API from '@/rest.js'
import { EventBus } from '@/util.js'

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
        EventBus.$emit('inform', {type: 'alert', variation: 'error', message: 'Lejátszási lista betöltési hiba!'})
        console.log(response.problem)
      }
    }
  },

  created () {
    this.getPlayList()
  }

}
</script>
