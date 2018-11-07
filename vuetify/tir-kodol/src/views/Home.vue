<template>
  <v-container>
    <v-layout justify-space-around wrap>
      <Card v-if="user.id" elevation="elevation-1">
        <Menu :items="showItems" @select="select($event)"/>
      </Card>
      <Card v-if="!user.id" title="Kérem jelentkezzen be!">
      </Card>
    </v-layout>
  </v-container>
<!--
      <Card v-if="user.id" elevation="elevation-1" :title="'Üdvözlöm ' + user.name + '!'">
      <v-btn color="primary" @click="restartBackend">Restart backend</v-btn>
-->
</template>

<script>
import { get } from 'vuex-pathify'
import Card from '@/components/base/Card.vue'
import Menu from '@/components/base/Menu.vue'

export default {
  name: 'home',
  components: {
    Card,
    Menu
  },

  computed: {
    ...get(['user']),

    showItems () {
      if (!this.user.id) return []
      const items = [
        { show: false, path: '/kodol', icon: 'info', title: 'Kódolás' },
        { show: false, path: '/atad', icon: 'info', title: 'Átadás' },
        { show: true, path: '/munkalap', icon: 'info', title: 'Munkalap információk' },
        { show: true, path: '/seasearch', icon: 'info', title: 'Dokumentációk' },
        { show: true, path: '/norma', icon: 'info', title: 'Mai teljesítmény %' },
        { show: false, path: '/table', icon: 'info', title: 'Táblázatok' }
      ]
      return items.filter(item => item.show)
    }
  },

  methods: {
    select (item) {
      this.$store.set('appPageTitle', item.title)
    }
  },

  created () {
    this.$store.set('menuLevel', 0)
  }
}
</script>
