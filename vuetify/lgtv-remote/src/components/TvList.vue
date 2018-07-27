<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">TV lista</div> </v-card-title>
      <v-list>
        <template v-for="(item, index) in showTVs">
        <v-list-tile :key="item.id" avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.label" @click="$emit('select', item.id)"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple @click="power(item.id)">
              <v-icon :color="item.reachable ? 'teal' : 'grey'">power</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < showTVs.length" inset :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script>
import API from '@/rest.js'
import { EventBus } from '@/util.js'

const TV_LIST_INTERVAL = 1000
let setIntervalId

export default {
  name: 'TvList',
  data () {
    return {
      tvlist: []
    }
  },

  computed: {
    showTVs () {
      // return this.apps.filter(o => o.show)
      return this.tvlist
    }
  },

  methods: {
    async getTvList () {
      const response = await API.get('tv/tvlist')
      if (response.ok) {
        this.tvlist = response.data
      } else {
        this.tvlist = []
        console.log(response.problem)
      }
    },

    async power (tvId) {
      EventBus.$emit('inform', {type: 'alert', variation: 'info', message: 'power/' + tvId})
      const response = await API.post('tv/power/' + tvId)
      console.log(response.data)
    }
  },

  created () {
    this.getTvList()
    setIntervalId = setInterval(this.getTvList, TV_LIST_INTERVAL)
  },

  destroyed () {
    clearInterval(setIntervalId)
  }
}
</script>
