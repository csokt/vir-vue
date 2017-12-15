<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>


<script>
import Store from './store'

export default {
  name: 'root',
  data () {
    return {
      store: Store
    }
  },
  mounted () {
    console.log('App subscribe')
    this.$mqtt.subscribe(this.store.responseBase + '#')
  },
  beforeDestroy () {
    console.log('App unsubscribe')
    this.$mqtt.unsubscribe(this.store.responseBase + '#')
  }
}
</script>

<style lang="stylus">
.q-btn
  margin-top 2em
  margin-right 1em
.q-if
  font-size 1.2rem
.q-item
  font-size 1.2rem
.q-field
  margin-top 8px
input.q-input-target
  height 1.5rem
</style>
