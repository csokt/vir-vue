<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import API from './rest.js'
import Store from './store'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, 1000 * time))

export default {
  data () {
    return {
      store: Store
    }
  },

  methods: {
    async getPlayLists () {
      const response = await API.get('tv/playlists')
      if (response.ok) {
        this.store.playlists = response.data
      }
      else {
        this.store.playlists = []
        console.log(response.problem)
      }
    },

    async getViews () {
      const response = await API.get('tv/views')
      if (response.ok) {
        this.store.views = response.data
      }
      else {
        this.store.views = []
        console.log(response.problem)
      }
    }
  },

  created () {
    this.getPlayLists()
    this.getViews()
  },

  watch: {
    'store.playlist': async function (playlist) {
      if (!playlist) { return }
      let i = 0
      while (true) {
        if (i >= playlist.views.length) { i = 0 }
        let view = playlist.views[i]
        this.$router.replace('/')
        await sleep(0)
        this.$router.replace('/table/' + view.id)
        await sleep(view.interval)
        i++
      }
    }
  }
}
</script>
