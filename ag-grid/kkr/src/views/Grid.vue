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

    async requestData (whereIndex) {
      this.rowData = null
      if (!this.grid.pipe) {
        this.statusMessage = 'Invalid handler!'
        return
      }
      this.statusMessage = 'betöltés...'
      const sqlWhere = this.grid.where.length ? this.grid.where[whereIndex].value : '1=1'
      let msg = { error: false, payloadArray: [] }
      for (const item of this.grid.pipe) {
        switch (item.type) {
          case 'inject':
            msg.payload = item.payload
            break
          case 'replacewhere':
            msg.payload = msg.payload.replace('{where}', sqlWhere)
            break
          case 'replaceparams':
            for (const key in msg.params) {
              msg.payload = msg.payload.split('{' + key + '}').join(msg.params[key])
            }
            break
          case 'apicall':
            const response = await API.post(item.api, { sql: msg.payload })
            if (response.ok) {
              msg.payload = response.data
              msg.payloadArray.push(msg.payload)
            } else {
              msg.error = true
              msg.payload = []
              this.statusMessage = response.data.error.message
            }
            break
          case 'alasql':
            msg.payload = alasql(msg.payload, msg.payloadArray)
            break
          case 'function':
            try {
              item.code(msg)
            } catch (error) {
              msg.error = true
              msg.payload = []
              this.statusMessage = 'Grid function error!'
              console.log(error)
            }
            break
          case 'logpayload':
            console.log(JSON.parse(JSON.stringify(msg.payload)))
            break
          case 'logmsg':
            console.log(JSON.parse(JSON.stringify(msg)))
            break
          case 'logpipe':
            console.log(this.grid.pipe)
            break
          case 'break':
            msg.error = true
            this.statusMessage = 'Break!'
            console.log(JSON.parse(JSON.stringify(msg.payload)))
            break
          default:
            console.log('Unknown pipetype', item.type)
            break
        }
        if (msg.error) break
      }
      if (Array.isArray(msg.payload)) {
        msg.payload.forEach(Object.freeze)
        this.rowData = Object.freeze(msg.payload)
      } else {
        this.rowData = []
      }
      if (!msg.error) this.statusMessage = ''
      // console.log('msg', msg)
      await this.$nextTick()
      this.columnApi.autoSizeColumns(this.columnApi.getAllColumns())
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
