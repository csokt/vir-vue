<template>
  <div>
    {{playlist.label}}
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
  computed: {
    playlist () {
      return Config.playlists.find(o => o.id === this.$route.params.id)
    }
  },
  methods: {
  },
  created () {
    this.store.playlist = this.playlist
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
