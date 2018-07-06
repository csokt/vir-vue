<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ol>
      <li>Név --- Bekapcsolva</li>
      <li v-for="tv in tvlist" v-bind:key="tv.id" >
      <span @click="$emit('select', tv.id)"> {{ tv.label }} </span>
      ---
      <span @click="power(tv.id)"> {{ tv.reachable }} </span>
      </li>
    </ol>
  </div>
</template>

<script>
import API from '@/rest.js'

const TV_LIST_INTERVAL = 1000
let setIntervalId

export default {
  name: 'TvList',

  props: {
    msg: String
  },

  data () {
    return {
      tvlist: []
    }
  },

  methods: {
    async getTvList () {
      const response = await API.get('tv/tvlist')
      if (response.ok) {
        this.tvlist = response.data
      } else {
        this.tvlist = []
        console.log(response.problem)
      }
    },

    async power (tvId) {
      const response = await API.post('tv/power/' + tvId)
      console.log(response.data)
    }
  },

  created () {
    this.getTvList()
    setIntervalId = setInterval(this.getTvList, TV_LIST_INTERVAL)
  },

  destroyed () {
    clearInterval(setIntervalId)
  }
}
</script>
