<template>
  <div id="app">

    <div style="width: 500px; max-width: 95vw;">
      <TheDecodeAllDemo></TheDecodeAllDemo>
    </div>
  </div>
</template>

<script>
import TheDecodeAllDemo from './demos/TheDecodeAllDemo'

export default {
  name: 'app',

  data () {
  },

  components: {
    TheDecodeAllDemo
  }
}
</script>

<style lang="stylus">
.container
  with 100px
</style>
