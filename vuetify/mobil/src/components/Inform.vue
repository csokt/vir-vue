<template>
  <div>
    <h3>{{ message }}</h3>
  </div>
</template>

<script>
import { EventBus } from '@/util.js'

export default {
  name: 'inform',
  components: {
  },

  data () {
    return {
      message: ''
    }
  },

  methods: {
  },

  created () {
    EventBus.$on('inform', event => {
      this.message = event.message
      setTimeout(() => { this.message = '' }, 1500)
    })
  }
}
</script>
