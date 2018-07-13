<template>
  <div>
    <h3>{{ msg }}</h3>
    <ol>
      <li v-for="app in apps" v-bind:key="app.title" @click="start(app)">
        {{ app.title }}
      </li>
    </ol>
  </div>
</template>

<script>
import { startApp } from '@/backend/rest.js'
import Store from '@/store'

export default {
  name: 'appstart',
  props: {
    msg: String
  },

  data: () => ({
    store: Store,
    apps: [
      { active: true, title: 'TV távvezérlés', avatar: '/static/dama.png', href: 'http://localhost:9000/#/' },
      { active: true, title: 'Termelés Inf. Rendszer', avatar: '/static/dama.png', href: 'https://tir.szefo.local' },
      { active: true, title: 'Legrand készlet', avatar: '/static/legrand.png', href: 'https://lir-keszlet.szefo.local' },
      { title: 'Chance készlet', avatar: '/static/chance.png', href: 'https://chance-keszlet.szefo.local' },
      { title: 'Tárgyi eszköz', avatar: '/static/eszkoz.png', href: 'https://eszkozinfo.szefo.local' }
    ]
  }),

  methods: {
    start (app) {
      console.log(app)
      startApp(app.href)
      // window.location.href = app.href
    }
  }
}
</script>
