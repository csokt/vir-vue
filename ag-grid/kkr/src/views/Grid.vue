<template>
  <BaseGrid
    :gridId="gridId"
    :grid="grid"
    :rowData="rowData"
    :errorMessage="errorMessage"
    @grid-ready="onGridReady"
    @select="onSelect"
  />
</template>

<script>
import str2template from 'string-to-template'
import Store from '@/store'
import Config from '@/config'
import { API } from '@/util'
import BaseGrid from '@/components/BaseGrid.vue'

export default {
  name: 'grid',
  components: {
    BaseGrid
  },

  data () {
    return {
      store: Store,
      gridId: null,
      grid: {},
      sqlWhere: '',
      rowData: null,
      gridApi: null,
      columnApi: null,
      errorMessage: ''
    }
  },

  watch: {
    'store.loggedIn': function () {
      if (this.store.loggedIn) this.requestData()
    }
  },

  methods: {
    onGridReady (params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },

    async requestData () {
      if (this.grid.mssql) {
        const sql = this.grid.mssql.replace('{where}', this.sqlWhere)
        const response = await API.post('tir/call', { sql: sql })
        if (response.ok) {
          response.data.forEach(Object.freeze)
          this.rowData = Object.freeze(response.data)
        } else {
          this.rowData = []
          this.errorMessage = response.data.error.message
        }
        await this.$nextTick()
        this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
      } else {
        this.rowData = []
      }
    },

    onSelect (content) {
      // console.log('content', content)
      if (!this.grid.onClick || !this.grid.onClick[content.column]) return
      const item = this.grid.onClick[content.column]
      if (!item.path) return
      const path = str2template(item.path, { ...content.data })
      const where = item.where ? str2template(item.where, { ...content.data }) : '1=1'
      const url = window.location.origin + '/grid/' + path + '?where=' + where
      let win = window.open(url, '_blank')
      if (win) {
        win.focus()
      } else {
        alert('Engedélyezze a felugró ablakokat ezen az oldalon!')
      }
    }
  },

  created () {
    this.gridId = this.$route.params.id
    this.grid = Config[this.gridId] || { title: 'Nincs ilyen táblázat!' }
    this.sqlWhere = this.$route.query.where ? this.$route.query.where : this.grid.where ? this.grid.where : '1=1'
    // if (this.$route.query.where) this.sqlWhere = this.$route.query.where
    if (this.store.loggedIn) this.requestData()
  },

  mounted () {
  }
}
</script>
