<template>
  <div>
    <h1>{{ msg }}</h1>
    <ol>
      <li>Név: {{tv.label}}</li>
      <li>IP: {{tv.ip}}</li>
      <li>Bekapcsolva: {{tv.reachable}}</li>
    </ol>
    <br>
    <button @click="$emit('select', 'power')">Power</button>
    <br>
    <button @click="$emit('select', 'fullscreen')">Fullscreen</button>
    <br>
    <button @click="$emit('select', 'mute', 'true')">Mute</button>
    <br>
    <button @click="$emit('select', 'volumeup')">Volume up</button>
    <br>
    <button @click="$emit('select', 'volumedown')">Volume down</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'HOME')">Home</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'BACK')">Back</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'LEFT')">Left</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'RIGHT')">Right</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'UP')">Up</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'DOWN')">Down</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'ENTER')">OK</button>
    <br>
    <button @click="$emit('select', 'pointerbutton', 'EXIT')">Exit</button>
    <br>
    <button @click="$emit('select', 'startapp', 'miracast')">Miracast</button>
    <br>
    <button @click="$emit('select', 'startapp', 'photovideo')">Photovideo</button>
  </div>
</template>

<script>
import API from '@/rest.js'

const TV_LIST_INTERVAL = 1000
let setIntervalId

export default {
  name: 'remote',

  props: {
    msg: String
  },

  data () {
    return {
      tv: {}
    }
  },

  methods: {
    async getTv () {
      try {
        const response = await API.get('tv/tvlist/' + this.$route.params.id)
        this.tv = response.data
      } catch (err) {
        this.tv = {}
        console.log(err)
      }
    }
  },

  created () {
    this.getTv()
    setIntervalId = setInterval(this.getTv, TV_LIST_INTERVAL)
  },

  destroyed () {
    clearInterval(setIntervalId)
  }
}
</script>
