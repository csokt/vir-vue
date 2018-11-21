<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Táblázatok</div> </v-card-title>
      <v-list>
        <template v-for="(item, index) in viewlist">
        <v-list-tile :key="item.id" avatar @click="$emit('select', 'table', item.id)">
          <v-list-tile-content>
            <v-list-tile-title v-html="item.label"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-if="index + 1 < viewlist.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-flex>
</template>

<script>
import API from '@/rest.js'
import { EventBus } from '@/util.js'
import Store from '@/store'

export default {
  name: 'viewlist',
  data () {
    return {
      store: Store,
      viewlist: []
    }
  },

  methods: {
    async getViewList () {
      const response = await API.get('config/views/tv/' + this.store.user.tv_role)
      if (response.ok) {
        this.viewlist = response.data
      } else {
        this.viewlist = []
        EventBus.$emit('inform', { type: 'alert', variation: 'error', message: 'Táblázatok betöltési hiba!' })
        console.log(response.problem)
      }
    }
  },

  created () {
    this.getViewList()
  }

}
</script>
