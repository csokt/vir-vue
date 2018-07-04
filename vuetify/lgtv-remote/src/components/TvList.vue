<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li>Név --- Bekapcsolva</li>
      <li v-for="tv in tvlist" v-bind:key="tv.id" >
      <span @click="$emit('select', tv.id)"> {{ tv.label }} </span>
      ---
      <span @click="$emit('power', tv.id)"> {{ tv.reachable }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
import REST from '@/rest.js'

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
      try {
        const response = await REST.get('tvlist')
        this.tvlist = response.data
        // console.log(this.tvlist)
      } catch (err) {
        this.tvlist = []
        console.log(err)
      }
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
