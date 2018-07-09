<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <h6 v-if="store.teszt" class="text-negative text-center">##### TESZT #####<hr></h6>
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
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
    window.oncontextmenu = function (event) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    // axios.get('https://api.ipify.org/?format=json') // Limitations: none, adblock-kal nem megy
    // axios.get('https://api.ipdata.co/') // Limitations: 1,500 requests per day
    // axios.get('https://ipapi.co/json/') // Limitations: 1,000 requests per day
    // axios.get('https://jsonip.com/') // Limitations: none, adblock-kal nem megy
    // axios.get('https://freegeoip.net/json') // Limitations: none, adblock-kal nem megy
    axios.get('https://httpbin.org/ip') // Limitations: none
      .then(function (response) {
        // Store.publicIP = response.data.ip
        Store.publicIP = response.data.origin
        // console.log(response.data.ip)
        console.log(response.data.origin)
      })
      .catch(function (error) {
        console.log(error)
      })

    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection // compatibility for Firefox and chrome
    const pc = new RTCPeerConnection({iceServers: []}), noop = function () {}
    pc.createDataChannel('') // create a bogus data channel
    pc.createOffer(pc.setLocalDescription.bind(pc), noop) // create offer and set local description
    pc.onicecandidate = function (ice) {
      if (ice && ice.candidate && ice.candidate.candidate) {
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]
        Store.privateIP = myIP
        console.log('my IP: ', myIP)
        pc.onicecandidate = noop
      }
    }
  }
}
</script>
