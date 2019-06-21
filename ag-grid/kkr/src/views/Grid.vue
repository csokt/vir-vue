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
      rowData: null
    }
  },

  methods: {
    async requestData () {
      const response = await API.post('tir/call', { sql: this.grid.mssql })
      this.rowData = response.data
    }
  },

  created () {
    this.grid = Config[this.$route.params.id] || { title: 'Nincs ilyen táblázat!' }
    if (this.grid.mssql) {
      this.requestData()
    } else {
      this.rowData = []
    }
  },

  mounted () {
  }
}
</script>
