<template>
  <v-flex xs12 sm8 md5>
    <v-card class="elevation-12">
      <v-card-title> <div class="title grey--text">Távirányító</div> </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="tv.label"
          solo
          readonly
          :background-color="tv.reachable ? 'teal' : 'grey'"
        ></v-text-field>
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

      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import API from '@/rest.js'
import { EventBus } from '@/util.js'

const TV_LIST_INTERVAL = 1000
let setIntervalId

export default {
  name: 'remote',
  data () {
    return {
      tv: {}
    }
  },

  methods: {
    async getTv () {
      const response = await API.get('tv/' + this.$route.params.id)
      if (response.ok) {
        this.tv = response.data
      } else {
        this.tv = {}
        EventBus.$emit('inform', {type: 'alert', variation: 'error', message: 'TV betöltési hiba!'})
        console.log(response.problem)
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
