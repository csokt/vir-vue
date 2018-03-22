<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <h6 v-if="store.teszt" class="text-negative text-center">##### TESZT #####<hr></h6>
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader)

import Store from './store'

export default {
  name: 'app',
  data () {
    return {
      store: Store
    }
  },

  created: function () {
    const url = new URL(window.location.href)
    this.store.teszt = url.searchParams.get('teszt') !== null
  }
}
</script>
