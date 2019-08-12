<template>
  <BaseGrid
    :grid="grid"
    :rowData="rowData"
    :dataReady="dataReady"
    :errorMessage="errorMessage"
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
      rowData: null,
      dataReady: false,
      errorMessage: ''
    }
  },

  methods: {
    async requestData () {
      const response = await API.post('tir/call', { sql: this.grid.mssql })
      if (response.ok) {
        response.data.forEach(Object.freeze)
        this.rowData = Object.freeze(response.data)
      } else {
        this.rowData = []
        this.errorMessage = response.data.error.message
      }
      this.dataReady = true
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
