<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader)

export default {}
</script>

<style lang="stylus">
.q-if
  font-size 1.2rem
.q-item
  font-size 1.2rem
.q-field
  margin-top 8px
input.q-input-target
  height 1.5rem
</style>
