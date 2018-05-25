<template>
  <v-container fluid fill-height grid-list-lg>
  <v-layout  justify-center wrap>
    <v-flex xs12 sm8 md5>
      <v-card class="elevation-12">
        <v-list>
          <template v-for="(item, index) in items">
          <v-list-tile :key="item.title" avatar @click="" :href="item.href">
            <v-list-tile-avatar tile>
              <img :src="item.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="item.title"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon small :color="item.active ? 'teal' : 'grey lighten-2'">brightness_1</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" inset :key="index"></v-divider>
          </template>
        </v-list>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" @click="teszt">Teszt</v-btn>
        </v-card-actions>

      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import Store from '../store'
import jaysonBrowserClient from 'jayson/lib/client/browser'

var callServer = function (request, callback) {
  var options = {
    method: 'POST',
    body: request,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch('http://localhost:3000', options)
    .then(function (res) { return res.text() })
    .then(function (text) { callback(null, text) })
    .catch(function (err) { callback(err) })
}

var client = jaysonBrowserClient(callServer, {
  // other options go here
})

export default {
  name: 'home',

  data: () => ({
    store: Store,
    items: [
      { active: true, title: 'Termelés Inf. Rendszer', avatar: '/static/dama.png', href: 'https://tir.szefo.local' },
      { active: true, title: 'Legrand készlet', avatar: '/static/legrand.png', href: 'https://lir-keszlet.szefo.local' },
      { title: 'Chance készlet', avatar: '/static/chance.png', href: 'https://chance-keszlet.szefo.local' },
      { title: 'Tárgyi eszköz', avatar: '/static/eszkoz.png', href: 'https://eszkozinfo.szefo.local' }
    ]
  }),

  created () {
    this.store.pageTitle = 'SZEFO alkalmazások'
  },

  methods: {
    teszt () {
      console.log('Teszt')
      client.request('multiply', [5, 5], function (err, error, result) {
        if (err) throw err
        console.log(result) // 25
      })
    }
  }
}
</script>
