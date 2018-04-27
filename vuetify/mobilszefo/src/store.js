import axios from 'axios'
// import { dom } from 'quasar'

const Store = {
  state: {
    teszt: null,
    privateIP: '',
    publicIP: '',
    device: null,
    video: {
      facingMode: null,
      width: 320,
      height: 240
    }
  },
  fireUser: null,
  user: null
}

function init () {
  function getviewport () {
    let e = window
    let a = 'inner'
    if (!('innerWidth' in window)) {
      a = 'client'
      e = document.documentElement || document.body
    }
    return {
      width: e[a + 'Width'],
      height: e[a + 'Height']
    }
  }

  const viewport = getviewport()
  const device = Math.max(viewport.height, viewport.width) < 800 ? 'phone' : 'tablet'
  const facingMode = device === 'phone' ? 'environment' : 'user'
  Store.state.device = device
  Store.state.video.facingMode = facingMode

  // axios.get('https://api.ipify.org/?format=json') // Limitations: none, adblock-kal nem megy
  // axios.get('https://api.ipdata.co/') // Limitations: 1,500 requests per day
  // axios.get('https://ipapi.co/json/') // Limitations: 1,000 requests per day
  // axios.get('https://jsonip.com/') // Limitations: none, adblock-kal nem megy
  // axios.get('https://freegeoip.net/json') // Limitations: none, adblock-kal nem megy
  axios.get('https://httpbin.org/ip') // Limitations: none
    .then(function (response) {
      Store.state.publicIP = response.data.origin
    })
    .catch(function (error) {
      console.log(error)
    })

  const url = new URL(window.location.href)
  Store.state.teszt = url.searchParams.get('teszt') !== null

  window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection // compatibility for Firefox and chrome
  const pc = new RTCPeerConnection({iceServers: []})
  const noop = function () {}
  pc.createDataChannel('') // create a bogus data channel
  pc.createOffer(pc.setLocalDescription.bind(pc), noop) // create offer and set local description
  pc.onicecandidate = function (ice) {
    if (ice && ice.candidate && ice.candidate.candidate) {
      const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1]
      Store.state.privateIP = myIP
      pc.onicecandidate = noop
    }
  }
}

init()

export default Store
