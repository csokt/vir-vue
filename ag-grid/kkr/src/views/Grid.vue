<template>
  <BaseGrid
    :gridId="gridId"
    :grid="grid"
    :rowData="rowData"
    :statusMessage="statusMessage"
    @grid-ready="onGridReady"
    @select="onSelect"
    @change-where="onChangeWhere"
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
      rowData: null,
      gridApi: null,
      columnApi: null,
      statusMessage: ''
    }
  },

  watch: {
    'store.loggedIn': function () {
      if (this.store.loggedIn) this.requestData(0)
    }
  },

  methods: {
    onGridReady (params) {
      console.log('params', params)
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },

    async requestData (whereIndex) {
      if (this.grid.mssql) {
        this.statusMessage = 'betöltés...'
        const sqlWhere = this.grid.where.length ? this.grid.where[whereIndex].value : '1=1'
        const sql = this.grid.mssql.replace('{where}', sqlWhere)
        console.log(sql)
        this.rowData = null
        const response = await API.post('tir/call', { sql: sql })
        if (response.ok) {
          response.data.forEach(Object.freeze)
          this.rowData = Object.freeze(response.data)
          this.statusMessage = ''
        } else {
          this.rowData = []
          this.statusMessage = response.data.error.message
        }
        await this.$nextTick()
        this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
      } else {
        this.statusMessage = 'Invalid handler!'
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
    },

    onChangeWhere (content) {
      // console.log('content', content)
      this.requestData(content)
    }
  },

  created () {
    this.gridId = this.$route.params.id
    this.grid = Config[this.gridId] || { title: 'Nincs ilyen táblázat!' }
    // where tömb előkészítése
    if (!this.grid.where) this.grid.where = []
    if (this.$route.query.where) this.grid.where.unshift({ label: 'Egyedi', value: this.$route.query.where })
    if (this.store.loggedIn) this.requestData(0)
  },

  mounted () {
  }
}
</script>
