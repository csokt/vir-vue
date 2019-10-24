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
import alasql from 'alasql'
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
    'store.loggedIn': async function () {
      if (this.store.loggedIn) {
        await this.requestData(0)
      }
    }
  },

  methods: {
    onGridReady (params) {
      // console.log('params', params)
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },

    async execSQL (msg, sql) {
      const query = sql.query
      console.log(query)
      const response = await API.post(sql.apiPath, { sql: query })
      if (response.ok) {
        msg.payload = response.data
      } else {
        msg.payload = []
        this.statusMessage = response.data.error.message
      }
      msg.payloadArray.push(msg.payload)
    },

    async requestData (whereIndex) {
      let gridSql = ''
      let apiPath = ''
      if (this.grid.mssql) {
        gridSql = this.grid.mssql
        apiPath = 'tir/call'
      }
      if (this.grid.pgraktar) {
        gridSql = this.grid.pgraktar
        apiPath = 'vir/raktarcall'
      }
      if (gridSql) {
        this.statusMessage = 'betöltés...'
        const sqlWhere = this.grid.where.length ? this.grid.where[whereIndex].value : '1=1'
        const sql = gridSql.replace('{where}', sqlWhere)
        console.log(sql)
        this.rowData = null
        const response = await API.post(apiPath, { sql: sql })
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
      } else if (this.grid.pipe) {
        let msg = { payloadArray: [] }
        this.rowData = null
        for (const item of this.grid.pipe) {
          if (item.type === 'sql') {
            await this.execSQL(msg, item)
          } else if (item.type === 'alasql') {
            msg.payload = alasql(item.query, msg.payloadArray)
          } else if (item.type === 'function') {
            item.code(msg)
          }
        }
        console.log('requestData msg', msg)
        msg.payload.forEach(Object.freeze)
        this.rowData = Object.freeze(msg.payload)
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
