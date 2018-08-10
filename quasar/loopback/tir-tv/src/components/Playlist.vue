<template>
  <div>
    <h5> {{$route.params.id}}: Nincs ilyen lejátszási lista! </h5>
  </div>
</template>

<script>
import Store from '../store'

export default {
  name: 'playlist',
  data () {
    return {
      store: Store
    }
  },

  created () {
    this.store.playlist = this.store.playlists.find(o => o.id === this.$route.params.id)
  },

  watch: {
    'store.playlists': function (playlists) {
      this.store.playlist = playlists.find(o => o.id === this.$route.params.id)
    }
  }
}
</script>

<style scoped>
</style>
