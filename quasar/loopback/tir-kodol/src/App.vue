<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <h6 v-if="store.teszt" class="text-negative text-center">##### TESZT #####<hr></h6>
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
// import axios from 'axios'
import VueQrcodeReader from 'vue-qrcode-reader'
Vue.use(VueQrcodeReader)

import API from './rest.js'
import Store from './store'

export default {
  name: 'app',
  data () {
    return {
      store: Store
    }
  },

  async created () {
    function urlParam (name) {
      const results = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i').exec(window.location.href)
      return results ? results[1] : null
    }

    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    const nodeEnv = await API.get('config/nodeEnv')
    this.store.teszt = nodeEnv.data !== 'production'

    const token = urlParam('token_uid')
    if (token) {
      const response = await API.post('accounts/pulltoken/' + token)
      if (response.ok) {
        API.setHeader('Authorization', response.data.loopback_token)
        const azonosito = response.data.user.tir_azonosito
        if (azonosito) {
          const response2 = await API.post('tir/belep/' + azonosito)
          if (response2.ok) {
            this.store.user = response2.data.user
            this.store.kodol = response2.data.kodol
          }
        }
      }
      else {
        console.log(response.problem)
      }
    }
    else {
      const response = await API.post('accounts/authlocal')
      if (response.ok) {
        API.setHeader('Authorization', response.data.id)
      }
    }

    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection // compatibility for Firefox and chrome
    const pc = new RTCPeerConnection({iceServers: []}), noop = function () {}
    pc.createDataChannel('') // create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop) // create offer and set local description
    pc.onicecandidate = function (ice) {
      if (ice && ice.candidate && ice.candidate.candidate) {
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]
        Store.privateIP = myIP
        pc.onicecandidate = noop
      }
    }
  },

  watch: {
    'store.user': async function (user) {
      if (!user) { return }
      let response = await API.get('config/ip')
      this.store.publicIP = response.ok && response.data
      response = await API.get('config/views/tablet/' + user.role)
      if (response.ok) {
        this.store.views = response.data
      }
      else {
        this.store.views = []
      }
    }
  }
}
</script>
