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
