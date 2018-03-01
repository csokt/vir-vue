<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Store from './store'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, 1000 * time))

export default {
  data () {
    return {
      store: Store
    }
  },
  watch: {
    'store.playlist': async function (playlist) {
      // console.log('playlist', playlist)
      let i = 0
      while (true) {
        if (i >= playlist.views.length) { i = 0 }
        let view = playlist.views[i]
        console.log(view.id)
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

<style lang="stylus">
.q-item
  font-size 1.5rem
</style>
