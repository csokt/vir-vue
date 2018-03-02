<template>
  <div>
    <h5> {{$route.params.id}}: Nincs ilyen lejátszási lista! </h5>
  </div>
</template>

<script>
import Config from '../config'
import Store from '../store'

export default {
  name: 'playlist',
  components: {
  },
  data () {
    return {
      store: Store
    }
  },
  created () {
    this.store.playlist = Config.playlists.find(o => o.id === this.$route.params.id)
  }
}
</script>

<style scoped>
</style>
