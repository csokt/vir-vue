<template>
  <BaseGrid
    :grid="grid"
    :rowData="rowData"
  />
</template>

<script>
import Config from '@/config.js'
import { API } from '@/util'
import BaseGrid from '@/components/BaseGrid.vue'

export default {
  name: 'grid',
  components: {
    BaseGrid
  },

  data () {
    return {
      grid: {},
      rowData: []
    }
  },

  methods: {
    async requestData () {
      const response = await API.post('tir/call', { sql: this.grid.sql })
      this.rowData = response.data
    }
  },

  created () {
    this.grid = Config[this.$route.params.id] || {}
  },

  mounted () {
    this.requestData()
  }
}
</script>
